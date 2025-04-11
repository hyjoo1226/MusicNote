from typing import List, Dict, Tuple
import numpy as np
from modelschemas.request_response import BigFiveScore, Report, WeeklyReport
from utils.recommender.job_recommender import JobRecommender
from utils.keyword_tools import KeywordTool
import warnings


class ReportGenerator:
    def __init__(self, use_korean: bool = False):
        self.recommender = JobRecommender()
        self.use_korean = use_korean
        self.keyword_tool = KeywordTool()  # ✅ 번역 및 저장 유틸

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

        self.trait_pair_summary: Dict[Tuple[str, str], str] = {
            ("openness", "conscientiousness"): "당신은 새로운 아이디어와 경험에 매우 열려있지만, 체계적인 계획이나 규칙을 따르는 것에는 어려움을 느낍니다. 창의적이고 혁신적인 생각은 많지만 이를 실행으로 옮기는 과정에서 지속성이 부족할 수 있습니다.",
            ("openness", "extraversion"): "당신은 지적 호기심이 매우 높고 새로운 아이디어를 탐색하는 것을 좋아하지만, 이를 다른 사람들과 활발히 공유하기보다는 혼자 깊이 생각하는 것을 선호합니다. 철학적이고 사색적인 내향적 창의인입니다.",
            ("openness", "agreeableness"): "당신은 지적으로 매우 개방적이고 새로운 개념을 탐구하는 데 열정적이지만, 다른 사람들의 감정이나 필요에 맞추기보다는 객관적 진실과 논리를 우선시합니다. 비판적 사고력이 뛰어난 지적 도전자입니다.",
            ("openness", "neuroticism"): "당신은 새로운 경험과 아이디어에 매우 열려있으면서도 정서적으로 안정되어 있습니다. 호기심과 모험심이 강하지만 스트레스 상황에서도 평정심을 유지하는 균형 잡힌 탐험가입니다.",

            ("conscientiousness", "openness"): "당신은 매우 체계적이고 책임감이 강하며 목표 지향적이지만, 기존의 방식을 고수하는 경향이 있습니다. 뛰어난 조직력과 자기 훈련으로 맡은 일을 완벽하게 해내지만, 새로운 아이디어나 변화에는 다소 저항감을 느낄 수 있습니다.",
            ("conscientiousness", "extraversion"): "당신은 매우 체계적이고 철저하며 책임감이 강하지만, 사회적 상호작용보다는 혼자 일하는 것을 선호합니다. 조용하고 신중하게 목표를 향해 꾸준히 나아가는 내향적 성취자입니다.",
            ("conscientiousness", "agreeableness"): "당신은 목표 달성과 효율성을 최우선시하며 매우 체계적으로 일하지만, 타인의 감정보다는 결과와 성과를 중시합니다. 원칙을 중요시하고 타협을 꺼리는 엄격한 관리자 스타일입니다.",
            ("conscientiousness", "neuroticism"): "당신은 매우 체계적이고 목표 지향적이면서도 정서적으로 안정되어 있습니다. 스트레스 상황에서도 침착함을 유지하며 계획대로 일을 진행할 수 있는 균형 잡힌 성취자입니다.",

            ("extraversion", "openness"): "당신은 매우 사교적이고 활동적이며 에너지가 넘치지만, 전통적이고 익숙한 것을 선호하는 경향이 있습니다. 사람들과 어울리고 대화하는 것을 즐기지만 추상적인 개념보다는 구체적이고 실용적인 주제에 더 관심이 있습니다.",
            ("extraversion", "conscientiousness"): "당신은 매우 활발하고 사교적이며 에너지가 넘치지만, 체계적인 계획이나 세부사항에는 덜 관심을 기울이는 경향이 있습니다. 즉흥적이고 자유로운 영혼으로, 엄격한 일정보다는 순간의 기회와 즐거움을 추구합니다.",
            ("extraversion", "agreeableness"): "당신은 매우 사교적이고 자기주장이 강하며 주목받는 것을 즐기지만, 타인의 필요나 감정에 맞추기보다는 자신의 목표를 우선시합니다. 카리스마 있고 경쟁적인 리더로, 사회적 상황을 주도하는 데 능숙합니다.",
            ("extraversion", "neuroticism"): "당신은 매우 사교적이고 활동적이면서도 정서적으로 안정되어 있습니다. 사람들과 어울리는 것을 즐기고 새로운 상황에 쉽게 적응하며, 스트레스나 부정적 감정에 거의 영향을 받지 않는 자신감 있는 사회적 리더입니다.",

            ("agreeableness", "openness"): "당신은 매우 협조적이고 타인을 배려하며 조화를 중시하지만, 전통적이고 익숙한 방식을 선호합니다. 따뜻하고 신뢰할 수 있는 지원자로, 사람들의 필요에 민감하게 반응하지만 급진적인 변화에는 불편함을 느낄 수 있습니다.",
            ("agreeableness", "conscientiousness"): "당신은 매우 따뜻하고 협조적이며 다른 사람들과의 조화를 중요시하지만, 체계적인 계획이나 규칙을 따르는 것에는 덜 관심을 기울입니다. 유연하고 관대한 성격으로, 엄격한 기준보다는 사람들의 감정과 관계를 우선시합니다.",
            ("agreeableness", "extraversion"): "당신은 매우 배려심이 깊고 협조적이지만, 사회적 상호작용보다는 소수의 깊은 관계를 선호합니다. 조용하고 겸손한 지원자로, 주목받기보다는 뒤에서 다른 사람들을 돕는 것에서 만족을 얻습니다.",
            ("agreeableness", "neuroticism"): "당신은 매우 협조적이고 타인을 배려하면서도 정서적으로 안정되어 있습니다. 따뜻하고 균형 잡힌 중재자로, 갈등 상황에서도 침착함을 유지하며 조화로운 해결책을 찾아냅니다.",

            ("neuroticism", "openness"): "당신은 감정적으로 민감하고 걱정이 많으며, 익숙하고 예측 가능한 환경을 선호합니다. 변화나 새로운 상황에 대한 불안감이 크고, 전통적이고 검증된 방식에 의지하는 경향이 있습니다.",
            ("neuroticism", "conscientiousness"): "당신은 감정적으로 매우 민감하고 불안감을 자주 경험하며, 체계적인 계획이나 규칙을 따르는 것에 어려움을 느낍니다. 감정의 기복이 크고 즉흥적인 결정을 내리는 경향이 있습니다.",
            ("neuroticism", "extraversion"): "당신은 감정적으로 매우 민감하고 내적 불안감이 크며, 사회적 상호작용보다는 혼자 있는 시간을 선호합니다. 내향적이고 자기성찰적인 성격으로, 사회적 상황에서 불편함을 느낄 수 있습니다.",
            ("neuroticism", "agreeableness"): "당신은 감정적으로 매우 민감하고 불안감이 크며, 타인의 의도를 의심하는 경향이 있습니다. 방어적이고 경계심이 강한 성격으로, 자신을 보호하기 위해 타인과 거리를 두는 경향이 있습니다.",
        }

    def generate_daily_report(self, data: BigFiveScore) -> Report:
        data_dict = data.dict()
        top_score = max(data_dict, key=data_dict.get)
        low_score = min(data_dict, key=data_dict.get)

        top_text = self.top_score_text[top_score]
        low_text = self.low_score_text[low_score]

        # 관심 키워드 추출
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

        # 템플릿 기반 summary 문장 조합
        pair_summary = self.trait_pair_summary.get((top_score, low_score))
        if not pair_summary:
            pair_summary = f"{top_text} 하지만 {low_text}"

        keyword_text = ""
        if keywords:
            top_keywords = ", ".join(keywords[:5])
            keyword_text = f" 추천된 관심 키워드는 '{top_keywords}' 등이 있으며, 이러한 주제와 관련된 콘텐츠 탐색을 권장합니다."

        summary_text = pair_summary

        return Report(
            top_score=top_score,
            top_text=top_text,
            low_score=low_score,
            low_text=low_text,
            summary=summary_text
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

    def generate_today_quote(self, data: BigFiveScore) -> str:
        daily_quotes = {
            "openness": "새로운 아이디어를 받아들이기에 딱 좋은 날입니다. 상상력을 마음껏 펼쳐보세요!",
            "conscientiousness": "계획을 세우고 하나씩 실행해나가는 당신, 오늘도 성실한 하루가 될 거예요.",
            "extraversion": "사람들과의 대화 속에서 에너지를 얻어보세요. 좋은 인연이 기다리고 있을지도 몰라요!",
            "agreeableness": "당신의 따뜻한 말 한마디가 누군가에겐 큰 위로가 될 수 있어요.",
            "neuroticism": "마음의 안정을 위해 오늘은 나를 위한 시간을 가져보는 건 어떨까요?"
        }

        trait_kor = {
            "openness": "개방성",
            "conscientiousness": "성실성",
            "extraversion": "외향성",
            "agreeableness": "우호성",
            "neuroticism": "신경성"
        }

        data_dict = data.dict()
        top_score = max(data_dict, key=data_dict.get)
        quote = daily_quotes.get(top_score, "")
        top_trait_name = trait_kor.get(top_score, top_score.capitalize())

        return f"오늘은 '{top_trait_name}' 성향이 두드러집니다. {quote}"

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
