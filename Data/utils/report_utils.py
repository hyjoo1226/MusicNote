import pandas as pd
import numpy as np
from utils.model_utils import TRAITS

def generate_report(df_scaled, df_music, models):
    trait_scores = {t: [] for t in TRAITS}

    for _, row in df_scaled.iterrows():
        x = row.values
        for t in TRAITS:
            pred = models[t].predict([x])[0]
            trait_scores[t].append(pred)

    personality_avg = {t: np.mean(scores) for t, scores in trait_scores.items()}
    music_avg = df_music.mean().to_dict()

    report = pd.DataFrame([{**personality_avg, **music_avg}])
    return report

def save_report(df_report, path):
    df_report.to_csv(path, index=False)
