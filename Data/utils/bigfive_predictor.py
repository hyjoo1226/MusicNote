import pandas as pd
import numpy as np

def predict_bigfive(model, df: pd.DataFrame) -> np.ndarray:
    return model.predict(df)  # (n_samples, 5)
