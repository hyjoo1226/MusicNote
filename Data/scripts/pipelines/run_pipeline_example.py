# run_pipeline_example.py - 파이프라인 실행 스크립트 (argparse + 로그 + 진행도 + 주간/월간 리포트 확장)
import os
import argparse
import datetime
import subprocess
from tqdm import tqdm

# ====== 설정 ======
today = datetime.date.today().strftime("%Y-%m-%d")
log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)
log_path = os.path.join(log_dir, f"pipeline_{today}.log")

# ====== 명령어 실행 및 로그 기록 함수 ======
def run_with_logging(command, log_file, step_name):
    with open(log_file, "a") as f:
        f.write(f"\n>>> [{step_name}] Running: {command}\n")
        f.flush()
        process = subprocess.Popen(command, shell=True, stdout=f, stderr=f)
        process.communicate()
        f.write(f"[{step_name}] Completed.\n")

# ====== argparse CLI ======
parser = argparse.ArgumentParser(description="Run Personality Prediction Pipeline")
parser.add_argument('--mode', choices=['train', 'report', 'report_all', 'all'], default='all',
                    help="Pipeline mode")
args = parser.parse_args()

# ====== 실행 단계 진행도 시각화 ======
tasks = []
if args.mode in ['train', 'all']:
    tasks.append(("Initial Training Pipeline", "python scripts/pipelines/00_train_pipeline.py"))
if args.mode in ['report', 'all', 'report_all']:
    tasks.append(("Generate Daily Report", "python scripts/pipelines/01_generate_report.py"))
if args.mode in ['report_all', 'all']:
    tasks.append(("Aggregate Weekly/Monthly Report", "python scripts/pipelines/weekly_report_generator.py"))

print(f"Starting Pipeline in '{args.mode}' mode. Log: {log_path}\n")

for step_name, cmd in tqdm(tasks, desc="Pipeline Progress", bar_format="{l_bar}{bar} | {n_fmt}/{total_fmt} [{elapsed}]"):
    print(f"▶ {step_name}...")
    run_with_logging(cmd, log_path, step_name)

print(f"\nAll steps completed! Log saved to: {log_path}")
