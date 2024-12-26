import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserDto } from '../model/user';
import { ApiService } from './api.service';
import jwtDecode from 'jwt-decode';
import { Campaign } from '../model/campaign';


@Injectable({ providedIn: 'root' })
export class CampaignService {
  constructor(
      private router: Router,
      private apiService: ApiService
  ) {}

  getCampaigns() {
    return this.apiService.get('campaigns');
  }

  createCampaign(campaign: Campaign) {
    return this.apiService.post('campaigns', campaign);
  }

  deleteCampaign(id: number) {
    return this.apiService.delete(`campaigns/${id}`);
  }

  updateCampaign(campaign: Campaign) {
    return this.apiService.patch(`campaigns/${campaign.id}`, campaign);
  }

  updateCampaignCharacters(campaignId: number, characterIds: number[]) {
    return this.apiService.post(`campaigns/${campaignId}/characters`, characterIds);
  }

  updateCampaignUsers(campaignId: number, userIds: number[]) {
    return this.apiService.post(`campaigns/${campaignId}/users`, userIds);
  }

}
