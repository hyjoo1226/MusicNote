import pandas as pd

workstyles = pd.read_csv("data/raw_data/WorkStyles.txt", delimiter="\t")
occupations = pd.read_csv("data/raw_data/OccupationData.txt", delimiter="\t")

# 직업 코드별로 Element Name (특성명)을 열로 pivot
pivoted = workstyles.pivot(index='O*NET-SOC Code', columns='Element Name', values='Data Value').reset_index()

# 각 Big Five에 대응되는 특성 그룹
pivoted['openness'] = pivoted[['Innovation', 'Analytical Thinking']].mean(axis=1)
pivoted['conscientiousness'] = pivoted[['Dependability', 'Attention to Detail']].mean(axis=1)
pivoted['extraversion'] = pivoted[['Social Orientation', 'Leadership']].mean(axis=1)
pivoted['agreeableness'] = pivoted[['Cooperation', 'Concern for Others']].mean(axis=1)
pivoted['stability'] = pivoted[['Stress Tolerance', 'Self-Control']].mean(axis=1)  # 낮은 Neuroticism 의미

merged = pd.merge(
    pivoted,
    occupations[['O*NET-SOC Code', 'Title', 'Description']],
    on='O*NET-SOC Code',
    how='left'
)

# 컬럼 정리
recommend_df = merged[['Title', 'Description', 'openness', 'conscientiousness', 'extraversion', 'agreeableness', 'stability']]
recommend_df = recommend_df.rename(columns={'Title': 'occupation'})

recommend_df.to_csv("data/processed_data/onet_bigfive_mapped.csv", index=False)
print("✅ 추천용 데이터 저장 완료!")
