export interface IShippingAddressProps {
  street: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
}

export class ShippingAddressVo {
  private readonly _street: string;
  private readonly _city: string;
  private readonly _pincode: string;
  private readonly _state: string;
  private readonly _country: string;

  private constructor(props: IShippingAddressProps) {
    // assign the corresponding properties
    this._street = props.street;
    this._city = props.city;
    this._pincode = props.pincode;
    this._state = props.state;
    this._country = props.country;
  }

  static create(props: IShippingAddressProps): ShippingAddressVo {
    return new ShippingAddressVo(props);
  }

  // street getter
  get street(): string {
    return this._street;
  }

  // city getter
  get city(): string {
    return this._city;
  }

  // pincode getter
  get pincode(): string {
    return this._pincode;
  }

  // state getter
  get state(): string {
    return this._state;
  }

  // country getter
  get country(): string {
    return this._country;
  }

  equals(other: ShippingAddressVo): boolean {
    return (
      this._street === other.street &&
      this._city === other.city &&
      this._pincode === other.pincode &&
      this._state === other.state &&
      this._country === other.country
    );
  }
}
