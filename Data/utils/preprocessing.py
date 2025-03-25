import pandas as pd

def normalize_features(df, scaler):
    features = scaler.feature_names_in_.tolist()
    df_scaled = pd.DataFrame(scaler.transform(df[features]), columns=features)
    return df_scaled

def calculate_music_styles(df_scaled):
    df_music = pd.DataFrame()
    df_music['Mellow'] = 0.4 * df_scaled['valence'] + 0.3 * df_scaled['acousticness'] + 0.3 * df_scaled['instrumentalness']
    df_music['Unpretentious'] = 0.4 * df_scaled['acousticness'] + 0.3 * df_scaled['speechiness'] + 0.3 * df_scaled['liveness']
    df_music['Sophisticated'] = 0.6 * df_scaled['instrumentalness'] + 0.4 * df_scaled['tempo']
    df_music['Intense'] = 0.4 * df_scaled['energy'] + 0.3 * df_scaled['loudness'] + 0.3 * df_scaled['tempo']
    df_music['Contemporary'] = 0.4 * df_scaled['danceability'] + 0.3 * df_scaled['speechiness'] + 0.3 * df_scaled['energy']
    return df_music
