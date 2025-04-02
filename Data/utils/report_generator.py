# utils/report_generator.py

from modelschemas.request_response import BigFiveScore, Report
from utils.recommender.job_recommender import JobRecommender

top_score_text = {
    "openness": "새로움과 창의성을 즐기며 예술적 감수성이 풍부한 편입니다.",
    "conscientiousness": "계획적이고 책임감이 강하며 목표 달성에 집중하는 성향입니다.",
    "extraversion": "사교적이고 활발하며 사람들과의 상호작용에서 에너지를 얻습니다.",
    "agreeableness": "다정하고 공감 능력이 뛰어나며 타인과의 관계를 중시합니다.",
    "neuroticism": "감정 기복이 있으며 불안이나 걱정이 잦을 수 있습니다."
}

low_score_text = {
    "openness": "새로운 경험보다는 익숙한 것을 선호하는 경향이 있습니다.",
    "conscientiousness": "즉흥적이며 규칙이나 계획보다는 자유로운 흐름을 중시합니다.",
    "extraversion": "혼자 있는 것을 편안하게 여기며 내면 세계에 집중합니다.",
    "agreeableness": "의견이 뚜렷하며 타인의 말에 쉽게 흔들리지 않는 편입니다.",
    "neuroticism": "감정적으로 안정되어 있으며 스트레스 상황에서도 침착함을 유지합니다."
}

# ✅ JobRecommender는 전역에서 재사용
recommender = JobRecommender()


def generate_personality_report(data: BigFiveScore) -> Report:
    """
    성격 점수 기반 종합 리포트 생성 함수 (추천 키워드 포함)
    """
    data_dict = data.dict()
    top_score = max(data_dict, key=data_dict.get)
    low_score = min(data_dict, key=data_dict.get)

    top_text = top_score_text[top_score]
    low_text = low_score_text[low_score]

    # ✅ 추천 키워드 삽입
    user_scores = [
        data.openness,
        data.conscientiousness,
        data.extraversion,
        data.agreeableness,
        1 - data.neuroticism  # stability 계산
    ]
    keywords = recommender.get_keywords_from_bigfive(user_scores)
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

if __name__ == "__main__":
    from modelschemas.request_response import BigFiveScore

    sample_score = BigFiveScore(
        openness=0.68,
        conscientiousness=0.58,
        extraversion=0.42,
        agreeableness=0.53,
        neuroticism=0.74
    )

    report = generate_personality_report(sample_score)
    print(report.summary)

