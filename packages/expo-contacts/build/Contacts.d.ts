import { PermissionResponse, PermissionStatus } from 'unimodules-permissions-interface';
export declare type CalendarFormatType = typeof CalendarFormats.Gregorian | typeof CalendarFormats.Buddhist | typeof CalendarFormats.Chinese | typeof CalendarFormats.Coptic | typeof CalendarFormats.EthiopicAmeteMihret | typeof CalendarFormats.EthiopicAmeteAlem | typeof CalendarFormats.Hebrew | typeof CalendarFormats.ISO8601 | typeof CalendarFormats.Indian | typeof CalendarFormats.Islamic | typeof CalendarFormats.IslamicCivil | typeof CalendarFormats.Japanese | typeof CalendarFormats.Persian | typeof CalendarFormats.RepublicOfChina | typeof CalendarFormats.IslamicTabular | typeof CalendarFormats.IslamicUmmAlQura;
export declare type ContainerType = typeof ContainerTypes.Local | typeof ContainerTypes.Exchange | typeof ContainerTypes.CardDAV | typeof ContainerTypes.Unassigned;
export declare type ContactType = typeof ContactTypes.Person | typeof ContactTypes.Company;
export declare type FieldType = typeof Fields.ID | typeof Fields.ContactType | typeof Fields.Name | typeof Fields.FirstName | typeof Fields.MiddleName | typeof Fields.LastName | typeof Fields.MaidenName | typeof Fields.NamePrefix | typeof Fields.NameSuffix | typeof Fields.Nickname | typeof Fields.PhoneticFirstName | typeof Fields.PhoneticMiddleName | typeof Fields.PhoneticLastName | typeof Fields.Birthday | typeof Fields.NonGregorianBirthday | typeof Fields.Emails | typeof Fields.PhoneNumbers | typeof Fields.Addresses | typeof Fields.SocialProfiles | typeof Fields.InstantMessageAddresses | typeof Fields.UrlAddresses | typeof Fields.Company | typeof Fields.JobTitle | typeof Fields.Department | typeof Fields.ImageAvailable | typeof Fields.Image | typeof Fields.RawImage | typeof Fields.ExtraNames | typeof Fields.Note | typeof Fields.Dates | typeof Fields.Relationships;
export declare type Date = {
    day?: number;
    month?: number;
    year?: number;
    id: string;
    label: string;
    format?: CalendarFormatType;
};
export declare type Relationship = {
    label: string;
    name?: string;
    id: string;
};
export declare type Email = {
    email?: string;
    isPrimary?: boolean;
    label: string;
    id: string;
};
export declare type PhoneNumber = {
    number?: string;
    isPrimary?: boolean;
    digits?: string;
    countryCode?: string;
    label: string;
    id: string;
};
export declare type Address = {
    street?: string;
    city?: string;
    country?: string;
    region?: string;
    neighborhood?: string;
    postalCode?: string;
    poBox?: string;
    isoCountryCode?: string;
    label: string;
    id: string;
};
export declare type SocialProfile = {
    service?: string;
    localizedProfile?: string;
    url?: string;
    username?: string;
    userId?: string;
    label: string;
    id: string;
};
export declare type InstantMessageAddress = {
    service?: string;
    username?: string;
    localizedService?: string;
    label: string;
    id: string;
};
export declare type UrlAddress = {
    label: string;
    url?: string;
    id: string;
};
export declare type Image = {
    uri?: string;
    width?: number;
    height?: number;
    base64?: string;
};
export declare type Contact = {
    id: string;
    contactType: ContactType;
    name: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    maidenName?: string;
    namePrefix?: string;
    nameSuffix?: string;
    nickname?: string;
    phoneticFirstName?: string;
    phoneticMiddleName?: string;
    phoneticLastName?: string;
    company?: string;
    jobTitle?: string;
    department?: string;
    note?: string;
    imageAvailable?: boolean;
    image?: Image;
    rawImage?: Image;
    birthday?: Date;
    dates?: Date[];
    relationships?: Relationship[];
    emails?: Email[];
    phoneNumbers?: PhoneNumber[];
    addresses?: Address[];
    instantMessageAddresses?: InstantMessageAddress[];
    urlAddresses?: UrlAddress[];
    nonGregorianBirthday?: Date;
    socialProfiles?: SocialProfile[];
};
export declare type ContactResponse = {
    data: Contact[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};
export declare type ContactSort = typeof SortTypes.UserDefault | typeof SortTypes.FirstName | typeof SortTypes.LastName | typeof SortTypes.None;
export declare type ContactQuery = {
    pageSize?: number;
    pageOffset?: number;
    fields?: FieldType[];
    sort?: ContactSort;
    name?: string;
    id?: string | string[];
    groupId?: string;
    containerId?: string;
    rawContacts?: boolean;
};
export declare type FormOptions = {
    displayedPropertyKeys?: FieldType[];
    message?: string;
    alternateName?: string;
    allowsEditing?: boolean;
    allowsActions?: boolean;
    shouldShowLinkedContacts?: boolean;
    isNew?: boolean;
    cancelButtonTitle?: string;
    preventAnimation?: boolean;
    groupId?: string;
};
export declare type GroupQuery = {
    groupId?: string;
    groupName?: string;
    containerId?: string;
};
export declare type Group = {
    name?: string;
    id?: string;
};
export declare type ContainerQuery = {
    contactId?: string;
    groupId?: string;
    containerId?: string | string[];
};
export declare type Container = {
    name: string;
    id: string;
    type: ContainerType;
};
export { PermissionStatus, PermissionResponse };
/**
 * Returns whether the Contacts API is enabled on the current device. This does not check the app permissions.
 *
 * @returns Async `boolean`, indicating whether the Contacts API is available on the current device. Currently this resolves to `true` on iOS and Android only.
 */
export declare function isAvailableAsync(): Promise<boolean>;
export declare function shareContactAsync(contactId: string, message: string, shareOptions?: object): Promise<any>;
export declare function getContactsAsync(contactQuery?: ContactQuery): Promise<ContactResponse>;
export declare function getPagedContactsAsync(contactQuery?: ContactQuery): Promise<ContactResponse>;
export declare function getContactByIdAsync(id: string, fields?: FieldType[]): Promise<Contact | undefined>;
export declare function addContactAsync(contact: Contact, containerId?: string): Promise<string>;
export declare function updateContactAsync(contact: Contact): Promise<string>;
export declare function removeContactAsync(contactId: string): Promise<any>;
export declare function writeContactToFileAsync(contactQuery?: ContactQuery): Promise<string | undefined>;
export declare function presentFormAsync(contactId?: string | null, contact?: Contact | null, formOptions?: FormOptions): Promise<any>;
export declare function addExistingGroupToContainerAsync(groupId: string, containerId: string): Promise<any>;
export declare function createGroupAsync(name?: string, containerId?: string): Promise<string>;
export declare function updateGroupNameAsync(groupName: string, groupId: string): Promise<any>;
export declare function removeGroupAsync(groupId: string): Promise<any>;
export declare function addExistingContactToGroupAsync(contactId: string, groupId: string): Promise<any>;
export declare function removeContactFromGroupAsync(contactId: string, groupId: string): Promise<any>;
export declare function getGroupsAsync(groupQuery: GroupQuery): Promise<Group[]>;
export declare function getDefaultContainerIdAsync(): Promise<string>;
export declare function getContainersAsync(containerQuery: ContainerQuery): Promise<Container[]>;
export declare function getPermissionsAsync(): Promise<PermissionResponse>;
export declare function requestPermissionsAsync(): Promise<PermissionResponse>;
export declare const PHONE_NUMBERS = "phoneNumbers";
export declare const EMAILS = "emails";
export declare const ADDRESSES = "addresses";
export declare const IMAGE = "image";
export declare const RAW_IMAGE = "rawImage";
export declare const NOTE = "note";
export declare const BIRTHDAY = "birthday";
export declare const NON_GREGORIAN_BIRTHDAY = "nonGregorianBirthday";
export declare const NAME_PREFIX = "namePrefix";
export declare const NAME_SUFFIX = "nameSuffix";
export declare const PHONETIC_FIRST_NAME = "phoneticFirstName";
export declare const PHONETIC_MIDDLE_NAME = "phoneticMiddleName";
export declare const PHONETIC_LAST_NAME = "phoneticLastName";
export declare const SOCIAL_PROFILES = "socialProfiles";
export declare const IM_ADDRESSES = "instantMessageAddresses";
export declare const URLS = "urlAddresses";
export declare const DATES = "dates";
export declare const RAW_DATES = "rawDates";
export declare const RELATIONSHIPS = "relationships";
export declare const Fields: {
    ID: string;
    ContactType: string;
    Name: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    MaidenName: string;
    NamePrefix: string;
    NameSuffix: string;
    Nickname: string;
    PhoneticFirstName: string;
    PhoneticMiddleName: string;
    PhoneticLastName: string;
    Birthday: string;
    NonGregorianBirthday: string;
    Emails: string;
    PhoneNumbers: string;
    Addresses: string;
    SocialProfiles: string;
    InstantMessageAddresses: string;
    UrlAddresses: string;
    Company: string;
    JobTitle: string;
    Department: string;
    ImageAvailable: string;
    Image: string;
    RawImage: string;
    ExtraNames: string;
    Note: string;
    Dates: string;
    Relationships: string;
};
export declare const CalendarFormats: {
    Gregorian: string;
    Buddhist: string;
    Chinese: string;
    Coptic: string;
    EthiopicAmeteMihret: string;
    EthiopicAmeteAlem: string;
    Hebrew: string;
    ISO8601: string;
    Indian: string;
    Islamic: string;
    IslamicCivil: string;
    Japanese: string;
    Persian: string;
    RepublicOfChina: string;
    IslamicTabular: string;
    IslamicUmmAlQura: string;
};
export declare const ContainerTypes: {
    Local: string;
    Exchange: string;
    CardDAV: string;
    Unassigned: string;
};
export declare const SortTypes: {
    UserDefault: string;
    FirstName: string;
    LastName: string;
    None: string;
};
export declare const ContactTypes: {
    Person: string;
    Company: string;
};