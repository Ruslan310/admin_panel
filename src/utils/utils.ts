import moment from "moment";
import {Address, Customer} from "../models";

export const stringifyAddress = (address?: Address | null) => {
  return `${address?.address1}, ${address?.address2} ${address?.postCode}, ${address?.city}`
}

export const fullName = (customer?: Customer | null) => {
  return `${customer?.firstName} ${customer?.lastName}`
}

export const today = moment().format('dddd');

export const googleMapLink = (latitude: number, longitude: number) => `https://www.google.com/maps/place/${latitude},${longitude}`;

export const MAX_QUANTITY = 1000000;
export const IMAGE_URL_PREFIX = 'https://images173858-main.s3.amazonaws.com/public/'
