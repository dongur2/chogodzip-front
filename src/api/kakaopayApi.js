import api from '@/api/tokenApi';

const BASE_URL = '/api/kakaopay';
const headers = { 'Content-Type': 'multipart/form-data' };

export default {
 

  async sendRequest(payItem) {
    const formData = new FormData();
  
    formData.append('item_name', payItem.item_name);
    formData.append('total_amount', payItem.total_amount);
    formData.append('quantity', payItem.quantity);
    const { data } = await api.post(BASE_URL + '/kakaoPayRequest', formData, { headers });
    return data;
  },
  async getApprovalInfo(pg_token) {
    const formData = new FormData();
    formData.append('pg_token', pg_token);
    const { data } = await api.post(BASE_URL + '/kakaoPaySuccess', formData, { headers });
    return data;
  },

};
