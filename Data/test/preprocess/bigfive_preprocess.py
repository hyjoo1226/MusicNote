import pandas as pd
import os

file = '../dataset/personality-data.csv'
df = pd.read_csv(file)
df.columns = df.columns.str.strip()

df = df[~df['enjoy_watching'].isin([1, 2])]

# df 칼럼의 enjoy_watching의 이름, 수치 변경
df = df.rename(columns={'enjoy_watching' : 'probability'})
df['probability'] = df['probability'].replace({3:1, 4:2, 5:3})

big_five = ['openness', 'agreeableness', 'emotional_stability', 'conscientiousness', 'extraversion']

big_five_df = df[['userid', 'probability'] + big_five]

current_dir = os.getcwd()
output_path = os.path.join(current_dir, '../dataset/user_bigfive.csv')

big_five_df.to_csv(output_path, index=False)