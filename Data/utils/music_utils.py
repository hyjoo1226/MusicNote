import pandas as pd

def calculate_music_scores(df: pd.DataFrame) -> pd.DataFrame:
    df['Mellow'] = df[['valence', 'acousticness', 'instrumentalness']].mean(axis=1)
    df['Unpretentious'] = df[['acousticness', 'speechiness', 'liveness']].mean(axis=1)
    df['Sophisticated'] = df[['tempo', 'instrumentalness']].mean(axis=1)
    df['Intense'] = df[['energy', 'loudness', 'tempo']].mean(axis=1)
    df['Contemporary'] = df[['danceability', 'speechiness', 'energy']].mean(axis=1)
    return df

def scale_music_scores(df: pd.DataFrame, scaler) -> pd.DataFrame:
    music_cols = ['Mellow', 'Unpretentious', 'Sophisticated', 'Intense', 'Contemporary']
    df[music_cols] = scaler.transform(df[music_cols])
    return df
