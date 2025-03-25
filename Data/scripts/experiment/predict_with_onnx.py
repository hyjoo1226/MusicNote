import onnxruntime as ort
import numpy as np

# 세션 로딩
session = ort.InferenceSession("models/personality_model_quant.onnx")
input_name = session.get_inputs()[0].name

# 예시 입력 (float32)
sample = np.array([[0.7, 0.5, 0.1, 0.05, 0.2, 110.0, 0.6, -6.0, 0.8]], dtype=np.float32)

# 예측 실행
prediction = session.run(None, {input_name: sample})[0]
print("🎯 Big Five 예측 결과:", prediction)
