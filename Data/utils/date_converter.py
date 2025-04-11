from datetime import datetime, date
from typing import Optional

def convert_pubdate(pubdate_str: Optional[str]) -> Optional[date]:
    """
    YYYYMMDD 형식의 문자열을 date 객체로 변환.
    변환 불가한 경우 None 반환.
    """
    if not pubdate_str or not pubdate_str.isdigit() or len(pubdate_str) != 8:
        return None
    try:
        return datetime.strptime(pubdate_str, "%Y%m%d").date()
    except (ValueError, TypeError):
        return None
