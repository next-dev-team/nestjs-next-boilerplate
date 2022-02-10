export interface IMatchingResult {
  status?: string;
  msg?: string;
  data?: IMatchingListData[];
}

export interface IMatchingListData {
  matchid?: string;
  name?: string;
  leaguestageid?: string;
  startdate?: string;
  status?: string;
  leaguename?: string;
  haslineup?: string;
  hasincident?: string;
  countryid?: string;
  country?: string;
  round?: string;
  awayname?: string;
  awayscore?: string;
  awayscoreht?: string;
  homename?: string;
  homescore?: string;
  homescoreht?: string;
  homeid?: string;
  awayid?: string;
  leaguenamezh?: string;
  leaguenameth?: string;
  homenamezh?: string;
  homenameth?: string;
  awaynamezh?: string;
  awaynameth?: string;
  venue?: string;
  venuecity?: string;
  minutes?: string;
  injurymins?: string;
}

export interface ILeagueResult {
  status?: string;
  msg?: string;
  data?: ILeagueListData[];
}

export interface ILeagueListData {
  leagueid?: string;
  name?: string;
  gender?: string;
  startdate?: string;
  enddate?: string;
  countryid?: string;
  countryname?: string;
}

//!=================================== Mapping model for new api here =========================
export interface ICategoryResult {
  code?: number;
  results?: ICategoryResultData[];
}

export interface ICategoryResultData {
  id?: number;
  name_zh?: string;
  name_zht?: string;
  name_en?: string;
  updated_at?: number;
}

export interface IMatchResults {
  code?: number;
  query?: IMatchQueryResult;
  results?: IMatchResultData[];
}

/**
 *! matching result here...
 */
export interface IMatchQueryResult {
  total?: number;
  type?: string;
}

export interface IMatchResultData {
  id?: number;
  season_id?: number;
  competition_id?: number;
  home_team_id?: number;
  away_team_id?: number;
  status_id: number;
  match_time?: number;
  neutral?: number;
  note?: string;
  home_scores?: number[];
  away_scores?: number[];
  home_position?: string;
  away_position?: string;
  coverage?: IMatchCoverage;
  venue_id?: number;
  referee_id?: number;
  round?: Round;
  environment?: IMatchEnvironment;
  updated_at?: number;
  related_id?: number;
  agg_score?: number[];
}

export interface IMatchCoverage {
  mlive?: number;
  intelligence?: number;
  lineup?: number;
}

export interface Round {
  stage_id?: number;
  round_num?: number;
  group_num?: number;
}

export interface IMatchEnvironment {
  weather?: number;
  pressure?: string;
  temperature?: string;
  wind?: string;
  humidity?: string;
}

export interface ICompetitionResult {
  code?: number;
  query?: ICompetitionQuery;
  results?: ICompetitionResultData[];
}

export interface ICompetitionQuery {
  total?: number;
  type?: string;
  id?: number;
  min_id?: number;
  max_id?: number;
  limit?: number;
}

export interface ICompetitionResultData {
  id?: number;
  category_id?: number;
  country_id?: number;
  name_en?: string;
  name_zh?: string;
  name_zht?: string;
  short_name_en?: string;
  short_name_zh?: string;
  short_name_zht?: string;
  type?: number;
  cur_season_id?: number;
  cur_stage_id?: number;
  cur_round?: number;
  round_count?: number;
  logo?: string;
  updated_at?: number;
  host?: ICompetitionHost;
  divisions?: Array<number[]>;
  most_titles?: Array<number[] | number>;
  title_holder?: Array<number>;
  newcomers?: Array<number[]>;
  primary_color?: string;
  secondary_color?: string;
}

export interface ICompetitionHost {
  country?: string;
  city?: string;
}

export interface ITeamResult {
  code: number;
  query: ITeamQuery;
  results: ITeamResultData[];
}

export interface ITeamQuery {
  total: number;
  type: string;
  id: number;
  min_id: number;
  max_id: number;
  limit: number;
}
export interface ITeamResultData {
  id: number;
  competition_id: number;
  country_id: number;
  name_zh: string;
  short_name_zh: string;
  name_zht: string;
  short_name_zht: string;
  name_en: string;
  short_name_en: string;
  logo: string;
  national: number;
  foundation_time: number;
  website: string;
  manager_id: number;
  venue_id: number;
  market_value: number;
  market_value_currency: string;
  total_players: number;
  foreign_players: number;
  national_players: number;
  updated_at: number;
}

export interface IVenueResult {
  code: number;
  query: IVenueQuery;
  results: IVenueResultData[];
}

export interface IVenueQuery {
  total: number;
  type: string;
  id: number;
  min_id: number;
  max_id: number;
  limit: number;
}

export interface IVenueResultData {
  id: number;
  name_zh: string;
  name_en: string;
  capacity: number;
  city: string;
  country: string;
  country_id: number;
  updated_at: number;
}

export interface IMatchStatResultData {
  id?: number;
  stats?: IMatchStatStat[];
  incidents?: IMatchStatIncident[];
  tlive?: IMatchStatTlive[];
  score?: Array<number[] | number | string>;
}
export interface IMatchStatTlive {
  time: string;
  type: number;
  data: string;
  position: number;
  main?: number;
}
export interface IMatchStatStat {
  type: number;
  home: number;
  away: number;
}
export interface IMatchStatIncident {
  type: number;
  type_v2: number;
  position: number;
  time: number;
  second: number;
  player_id?: number;
  player_name?: string;
  in_player_id?: number;
  out_player_id?: number;
  in_player_name?: string;
  out_player_name?: string;
  home_score?: number;
  away_score?: number;
  assist1_id?: number;
  assist1_name?: string;
  reason_type?: number;
}

export interface IDeletedMatchResult {
  code?: number;
  results?: IDeletedMatchData;
}

export interface IDeletedMatchData {
  match?: number[];
}
