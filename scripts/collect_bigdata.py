import os
import json
import soccerdata as sd
import pandas as pd

def main():
    fbref = sd.FBref(leagues="Big 5 European Leagues Combined", seasons="2627")

    print("1/3 기본 및 기대득점(xG, xA, 전진패스) 데이터 수집 중...")
    df_std = fbref.read_player_season_stats(stat_type="standard").reset_index()

    print("2/3 슛 창출(SCA) 데이터 수집 중...")
    df_gca = fbref.read_player_season_stats(stat_type="goal_shot_creation").reset_index()

    print("3/3 수비(태클, 인터셉트) 데이터 수집 중...")
    df_def = fbref.read_player_season_stats(stat_type="defense").reset_index()

    def make_key(df):
        return df[('player', '')].astype(str) + "_" + df[('team', '')].astype(str)

    df_std['key'] = make_key(df_std)
    df_gca['key'] = make_key(df_gca)
    df_def['key'] = make_key(df_def)

    gca_map = df_gca.set_index('key')[('SCA', 'SCA90')].to_dict()
    tkl_map = df_def.set_index('key')[('Tackles', 'Tkl+Int')].to_dict()

    records = []
    for _, row in df_std.iterrows():
        try:
            minutes = int(row[('Playing Time', 'Min')] or 0)
            if minutes < 90:
                continue

            key = row['key']
            raw_pos = str(row[('pos', '')])
            main_pos = "FW" if "FW" in raw_pos else ("MF" if "MF" in raw_pos else ("DF" if "DF" in raw_pos else "GK"))
            if main_pos == "GK":
                continue

            goals = int(row[('Performance', 'Gls')] or 0)
            xg = float(row[('Expected', 'xG')] or 0.0)
            tkl_int = int(tkl_map.get(key, 0) or 0)

            records.append({
                "player_id": key,
                "player_name": str(row[('player', '')]),
                "league": str(row[('league', '')]),
                "team_name": str(row[('team', '')]),
                "position": main_pos,
                "age": int(str(row[('age', '')]).split('-')[0] or 22),
                "matches_played": int(row[('Playing Time', 'MP')] or 0),
                "minutes_played": minutes,
                "goals": goals,
                "assists": int(row[('Performance', 'Ast')] or 0),
                "xg": round(xg, 2),
                "npxg": round(float(row[('Expected', 'npxG')] or 0.0), 2),
                "xa": round(float(row[('Expected', 'xAG')] or 0.0), 2),
                "progressive_carries": int(row[('Progression', 'PrgC')] or 0),
                "progressive_passes": int(row[('Progression', 'PrgP')] or 0),
                "sca_per90": round(float(gca_map.get(key, 0.0) or 0.0), 2),
                "tackles_interceptions_per90": round((tkl_int / minutes) * 90, 2)
            })
        except Exception:
            continue

    output_file = "players_bigdata_2627.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    print(f"총 {len(records)}명의 최신 시즌 선수 데이터가 '{output_file}'에 저장되었습니다.")

    # Supabase 자동 업로드 (환경변수가 설정된 경우)
    supa_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    supa_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if supa_url and supa_key:
        from supabase import create_client
        supabase = create_client(supa_url, supa_key)
        supabase.table("player_season_stats").upsert(records).execute()
        print("Supabase DB 동기화 완료!")

if __name__ == "__main__":
    main()
