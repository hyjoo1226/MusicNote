# services/recommend_engine.py

"""
성격 예측 결과 기반 콘텐츠 추천 엔진
Big Five 성격 점수 → 추천 콘텐츠 카테고리 매핑 (음악, 영화 등)
"""

def recommend_content(personality_scores: dict) -> list:
    recommendations = []

    # Openness → 예술적/창의 콘텐츠
    if personality_scores.get("openness", 0) >= 0.6:
        recommendations.append({"type": "music", "title": "Jazz Fusion Playlist"})
        recommendations.append({"type": "book", "title": "Creativity Unleashed"})

    # Extraversion → 활발/파티 콘텐츠
    if personality_scores.get("extraversion", 0) >= 0.6:
        recommendations.append({"type": "music", "title": "EDM Party Hits"})
        recommendations.append({"type": "movie", "title": "Social Butterfly Documentary"})

    # Agreeableness → 감성 콘텐츠
    if personality_scores.get("agreeableness", 0) >= 0.6:
        recommendations.append({"type": "music", "title": "Warm Acoustic Vibes"})
        recommendations.append({"type": "movie", "title": "Heartwarming Drama"})

    # Conscientiousness → 고전/정리 콘텐츠
    if personality_scores.get("conscientiousness", 0) >= 0.6:
        recommendations.append({"type": "book", "title": "Time Management Essentials"})
        recommendations.append({"type": "music", "title": "Structured Classical Pieces"})

    # Neuroticism → 힐링/이완 콘텐츠
    if personality_scores.get("neuroticism", 0) >= 0.6:
        recommendations.append({"type": "music", "title": "Mindfulness Ambient Mix"})
        recommendations.append({"type": "app", "title": "Stress Relief Meditation App"})

    return recommendations