export interface User {
  id: string;
  name: string;
  email: string;
  countrycode: string;
  phoneNumber: string;
  nationality: string;
  UKVisaType: string;
  UKDrivinglicense: boolean;
  postalCode: string;
  noticePeriodDay: number;
  currentWork: string;
  lookingFor: string[];
  workPreference: string[];
  expectedDayRate: number;
  referredBy: string;
  sc_dv_clearance_hold: boolean;
  sc_dv_valid_upto: string;
  eligible_for_SC: boolean;
  callDay: string;
  callTime: string;
  preferredRoles: string[];
  anyQuestion: string;
  profilePicture: {
    url: string;
  };
  cv: {
    url: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserFilter {
  name: string;
  phoneNumber: string;
  email: string;
  country: string;
  UKDrivinglicense: string;
  nationality: string;
  currentWork: string;
  eligible_for_SC: string;
  sc_dv_clearance_hold: string;
  referredBy: string;
}

export interface UserResponse {
  status: boolean;
  data: User[];
  meta_data: {
    items: number;
    page: number;
    page_size: number;
  };
  message?: string;
}
