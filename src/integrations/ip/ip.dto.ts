export interface IpApiResponse {
  status: 'success' | 'fail';
  message?: string;
  country?: string;
  regionName?: string;
  city?: string;
}
