from typing import List, Dict
import numpy as np
from modelschemas.request_response import BigFiveScore, Report, WeeklyReport
from utils.recommender.job_recommender import JobRecommender
from utils.keyword_tools import KeywordTool
import warnings


class ReportGenerator:
    def __init__(self, use_korean: bool = False):
        self.recommender = JobRecommender()
        self.use_korean = use_korean
        self.keyword_tool = KeywordTool()  # ✅ 통합된 번역 + 저장 유틸

        self.top_score_text = {
            "openness": "새로움과 창의성을 즐기며 예술적 감수성이 풍부한 편입니다.",
            "conscientiousness": "계획적이고 책임감이 강하며 목표 달성에 집중하는 성향입니다.",
            "extraversion": "사교적이고 활발하며 사람들과의 상호작용에서 에너지를 얻습니다.",
            "agreeableness": "다정하고 공감 능력이 뛰어나며 타인과의 관계를 중시합니다.",
            "neuroticism": "감정 기복이 있으며 불안이나 걱정이 잦을 수 있습니다."
        }

        self.low_score_text = {
            "openness": "새로운 경험보다는 익숙한 것을 선호하는 경향이 있습니다.",
            "conscientiousness": "즉흥적이며 규칙이나 계획보다는 자유로운 흐름을 중시합니다.",
            "extraversion": "혼자 있는 것을 편안하게 여기며 내면 세계에 집중합니다.",
            "agreeableness": "의견이 뚜렷하며 타인의 말에 쉽게 흔들리지 않는 편입니다.",
            "neuroticism": "감정적으로 안정되어 있으며 스트레스 상황에서도 침착함을 유지합니다."
        }

    def generate_daily_report(self, data: BigFiveScore) -> Report:
        data_dict = data.dict()
        top_score = max(data_dict, key=data_dict.get)
        low_score = min(data_dict, key=data_dict.get)

        top_text = self.top_score_text[top_score]
        low_text = self.low_score_text[low_score]

        user_scores = [
            data.openness,
            data.conscientiousness,
            data.extraversion,
            data.agreeableness,
            1 - data.neuroticism
        ]
        keywords = self.recommender.get_keywords_from_bigfive(user_scores)
        if self.use_korean:
            keywords = self.keyword_tool.translate_and_save_keywords(keywords)

        keyword_text = ""
        if keywords:
            top_keywords = ", ".join(keywords[:5])
            keyword_text = f"추천된 관심 키워드는 '{top_keywords}' 등이 있으며, 이러한 주제와 관련된 콘텐츠 탐색을 권장합니다."

        return Report(
            top_score=top_score,
            top_text=top_text,
            low_score=low_score,
            low_text=low_text,
            summary=keyword_text
        )

    def generate_weekly_report(self, week_scores: List[BigFiveScore]) -> WeeklyReport:
        trait_names = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"]
        trends: Dict[str, str] = {}
        diffs = {}
        fluctuations = {}
        averages = {}

        valid_traits = []

        for trait in trait_names:
            values = [getattr(score, trait) for score in week_scores]

            trend_text = self._generate_natural_language_trend(trait, values)
            trends[trait] = trend_text

            if len(values) >= 3 and np.isfinite(values).all():
                valid_traits.append(trait)
                diffs[trait] = values[-1] - values[0]
                fluctuations[trait] = max(values) - min(values)
                averages[trait] = sum(values) / len(values)

        if valid_traits:
            top_growth = max(diffs, key=diffs.get)
            top_decline = min(diffs, key=diffs.get)
            top_fluctuation = max(fluctuations, key=fluctuations.get)
        else:
            top_growth = top_decline = top_fluctuation = "해당 없음"

        if averages:
            avg_scores = [
                averages.get("openness", 0),
                averages.get("conscientiousness", 0),
                averages.get("extraversion", 0),
                averages.get("agreeableness", 0),
                1 - averages.get("neuroticism", 0)
            ]
            keywords = self.recommender.get_keywords_from_bigfive(avg_scores)
            if self.use_korean:
                keywords = self.keyword_tool.translate_and_save_keywords(keywords)
        else:
            keywords = []

        keyword_text = ""
        if keywords:
            top_keywords = ", ".join(keywords[:5])
            keyword_text = f"이번 주 추천된 관심 키워드는 '{top_keywords}'입니다. 해당 주제에 대한 탐색을 권장합니다."
        else:
            keyword_text = "이번 주에는 유효한 성격 점수가 부족하여 키워드 추천이 제공되지 않았습니다."

        return WeeklyReport(
            trends=trends,
            summary=keyword_text,
            top_growth=top_growth,
            top_decline=top_decline,
            top_fluctuation=top_fluctuation
        )

    def _generate_natural_language_trend(self, trait: str, values: List[float]) -> str:
        min_required_len = 3

        trait_kor = {
            "openness": "개방성",
            "conscientiousness": "성실성",
            "extraversion": "외향성",
            "agreeableness": "우호성",
            "neuroticism": "신경성"
        }

        name = trait_kor.get(trait, trait.capitalize())

        if len(values) < min_required_len:
            return f"{name}은(는) 데이터 개수가 {min_required_len}개 미만으로 분석이 불가능합니다."

        if not np.isfinite(values).all():
            return f"{name} 점수에 유효하지 않은 값(NaN 또는 무한대)이 포함되어 있어 분석이 불가능합니다."

        try:
            with warnings.catch_warnings():
                warnings.simplefilter("ignore", category=RuntimeWarning)
                slope = np.polyfit(range(len(values)), values, 1)[0]

            fluctuation = max(values) - min(values)

            if fluctuation < 0.05:
                return f"{name}은 일주일간 큰 변화 없이 안정적인 수준을 유지했습니다."
            elif slope > 0.05:
                return f"{name}은 이번 주 동안 꾸준히 증가하는 양상을 보였습니다. 이는 관련 특성이 점차 두드러지고 있음을 시사합니다."
            elif slope < -0.05:
                return f"{name}은 전반적으로 감소하는 추세였으며, 해당 성향이 다소 약화된 모습이 관찰됩니다."
            else:
                return f"{name}은 일주일 내내 등락을 반복하며 불안정한 패턴을 보였습니다."

        except np.linalg.LinAlgError:
            return f"{name} 점수의 추세 분석 중 오류가 발생하여 분석이 불가능합니다."
