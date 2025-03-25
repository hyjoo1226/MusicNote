import joblib
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
from onnxruntime.quantization import quantize_dynamic, QuantType

# 1. 모델 로드
model_path = "models/personality_model_rf_multi.pkl"
model = joblib.load(model_path)

# 2. 입력 형식 정의 (feature 9개)
initial_type = [('float_input', FloatTensorType([None, 9]))]

# 3. ONNX 변환
onnx_path = model_path.replace(".pkl", ".onnx")
onnx_model = convert_sklearn(model, initial_types=initial_type)
with open(onnx_path, "wb") as f:
    f.write(onnx_model.SerializeToString())
print(f"✅ ONNX 변환 완료: {onnx_path}")

# 4. 양자화
quant_path = onnx_path.replace(".onnx", "_quant.onnx")
quantize_dynamic(onnx_path, quant_path, weight_type=QuantType.QUInt8)
print(f"✅ 양자화 완료: {quant_path}")
