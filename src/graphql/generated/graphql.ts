import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

/** Defines when a policy shall be executed. */
export enum ApplyPolicy {
  /** After the resolver was executed. */
  AfterResolver = 'AFTER_RESOLVER',
  /** Before the resolver was executed. */
  BeforeResolver = 'BEFORE_RESOLVER',
  /** The policy is applied in the validation step before the execution. */
  Validation = 'VALIDATION'
}

export type AssignBuildingAdminInput = {
  buildingId: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
};

export type Building = {
  __typename?: 'Building';
  address: Scalars['String']['output'];
  administrators: Array<User>;
  city: City;
  cityId: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  entries: Array<BuildingEntry>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

export type BuildingEntry = {
  __typename?: 'BuildingEntry';
  building: Building;
  buildingId: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  tenants: Array<Tenant>;
};

export type BuildingEntryFilterInput = {
  and?: InputMaybe<Array<BuildingEntryFilterInput>>;
  building?: InputMaybe<BuildingFilterInput>;
  buildingId?: InputMaybe<UuidOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<BuildingEntryFilterInput>>;
  tenants?: InputMaybe<ListFilterInputTypeOfTenantFilterInput>;
};

export type BuildingEntrySortInput = {
  building?: InputMaybe<BuildingSortInput>;
  buildingId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
};

export type BuildingFilterInput = {
  address?: InputMaybe<StringOperationFilterInput>;
  administrators?: InputMaybe<ListFilterInputTypeOfUserFilterInput>;
  and?: InputMaybe<Array<BuildingFilterInput>>;
  city?: InputMaybe<CityFilterInput>;
  cityId?: InputMaybe<UuidOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  entries?: InputMaybe<ListFilterInputTypeOfBuildingEntryFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<BuildingFilterInput>>;
};

export type BuildingSortInput = {
  address?: InputMaybe<SortEnumType>;
  city?: InputMaybe<CitySortInput>;
  cityId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
};

export type BuildingWithEntriesPayload = {
  __typename?: 'BuildingWithEntriesPayload';
  building: Building;
  entries: Array<BuildingEntry>;
  message: Scalars['String']['output'];
};

export type BuildingWithStats = {
  __typename?: 'BuildingWithStats';
  address: Scalars['String']['output'];
  adminCount: Scalars['Int']['output'];
  cityName: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  entryCount: Scalars['Int']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  tenantCount: Scalars['Int']['output'];
};

export type BulkOperationPayload = {
  __typename?: 'BulkOperationPayload';
  affectedCount: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type City = {
  __typename?: 'City';
  buildings: Array<Building>;
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

export type CityFilterInput = {
  and?: InputMaybe<Array<CityFilterInput>>;
  buildings?: InputMaybe<ListFilterInputTypeOfBuildingFilterInput>;
  code?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<CityFilterInput>>;
};

export type CitySortInput = {
  code?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
};

export type CityWithStats = {
  __typename?: 'CityWithStats';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  myBuildings: Scalars['Int']['output'];
  myTenants: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  totalBuildings: Scalars['Int']['output'];
  totalTenants: Scalars['Int']['output'];
};

export type CreateBuildingInput = {
  address: Scalars['String']['input'];
  cityId: Scalars['UUID']['input'];
  entryNames: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateCityInput = {
  code: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateMonthlyDecisionInput = {
  decidedByUserId: Scalars['UUID']['input'];
  month: Scalars['Int']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  status: DecisionStatus;
  tenantId: Scalars['UUID']['input'];
  year: Scalars['Int']['input'];
};

export type CreateSingleTenantInput = {
  buildingEntryId: Scalars['UUID']['input'];
  contactEmail: Scalars['String']['input'];
  contactPhone: Scalars['String']['input'];
  name: Scalars['String']['input'];
  unitNumber: Scalars['String']['input'];
};

export type CreateTenantInput = {
  contactEmail: Scalars['String']['input'];
  contactPhone: Scalars['String']['input'];
  name: Scalars['String']['input'];
  unitNumber: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: UserRole;
};

export type DateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  neq?: InputMaybe<Scalars['DateTime']['input']>;
  ngt?: InputMaybe<Scalars['DateTime']['input']>;
  ngte?: InputMaybe<Scalars['DateTime']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  nlt?: InputMaybe<Scalars['DateTime']['input']>;
  nlte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DecisionStats = {
  __typename?: 'DecisionStats';
  allowedThisMonth: Scalars['Int']['output'];
  decidedThisMonth: Scalars['Int']['output'];
  deniedThisMonth: Scalars['Int']['output'];
  pendingThisMonth: Scalars['Int']['output'];
  totalTenants: Scalars['Int']['output'];
};

export enum DecisionStatus {
  Allowed = 'ALLOWED',
  Denied = 'DENIED',
  Pending = 'PENDING'
}

export type DecisionStatusOperationFilterInput = {
  eq?: InputMaybe<DecisionStatus>;
  in?: InputMaybe<Array<DecisionStatus>>;
  neq?: InputMaybe<DecisionStatus>;
  nin?: InputMaybe<Array<DecisionStatus>>;
};

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
  ngt?: InputMaybe<Scalars['Int']['input']>;
  ngte?: InputMaybe<Scalars['Int']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nlt?: InputMaybe<Scalars['Int']['input']>;
  nlte?: InputMaybe<Scalars['Int']['input']>;
};

export type ListFilterInputTypeOfBuildingEntryFilterInput = {
  all?: InputMaybe<BuildingEntryFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<BuildingEntryFilterInput>;
  some?: InputMaybe<BuildingEntryFilterInput>;
};

export type ListFilterInputTypeOfBuildingFilterInput = {
  all?: InputMaybe<BuildingFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<BuildingFilterInput>;
  some?: InputMaybe<BuildingFilterInput>;
};

export type ListFilterInputTypeOfMonthlyDecisionFilterInput = {
  all?: InputMaybe<MonthlyDecisionFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<MonthlyDecisionFilterInput>;
  some?: InputMaybe<MonthlyDecisionFilterInput>;
};

export type ListFilterInputTypeOfTenantFilterInput = {
  all?: InputMaybe<TenantFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<TenantFilterInput>;
  some?: InputMaybe<TenantFilterInput>;
};

export type ListFilterInputTypeOfUserFilterInput = {
  all?: InputMaybe<UserFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<UserFilterInput>;
  some?: InputMaybe<UserFilterInput>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginPayload = {
  __typename?: 'LoginPayload';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type MonthlyDecision = {
  __typename?: 'MonthlyDecision';
  decidedByUser: User;
  decidedByUserId: Scalars['UUID']['output'];
  decisionDate: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  month: Scalars['Int']['output'];
  notes: Scalars['String']['output'];
  status: DecisionStatus;
  tenant: Tenant;
  tenantId: Scalars['UUID']['output'];
  year: Scalars['Int']['output'];
};

export type MonthlyDecisionFilterInput = {
  and?: InputMaybe<Array<MonthlyDecisionFilterInput>>;
  decidedByUser?: InputMaybe<UserFilterInput>;
  decidedByUserId?: InputMaybe<UuidOperationFilterInput>;
  decisionDate?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  month?: InputMaybe<IntOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<MonthlyDecisionFilterInput>>;
  status?: InputMaybe<DecisionStatusOperationFilterInput>;
  tenant?: InputMaybe<TenantFilterInput>;
  tenantId?: InputMaybe<UuidOperationFilterInput>;
  year?: InputMaybe<IntOperationFilterInput>;
};

export type MonthlyDecisionPayload = {
  __typename?: 'MonthlyDecisionPayload';
  decision: MonthlyDecision;
  message: Scalars['String']['output'];
};

export type MonthlyDecisionSortInput = {
  decidedByUser?: InputMaybe<UserSortInput>;
  decidedByUserId?: InputMaybe<SortEnumType>;
  decisionDate?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  month?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  tenant?: InputMaybe<TenantSortInput>;
  tenantId?: InputMaybe<SortEnumType>;
  year?: InputMaybe<SortEnumType>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addBuildingEntry: BuildingEntry;
  adminResetUserPasswordByEmail: SuccessPayload;
  assignBuildingAdmin: SuccessPayload;
  changeMyPassword: SuccessPayload;
  createBuilding: BuildingWithEntriesPayload;
  createCity: City;
  createMultipleTenants: BulkOperationPayload;
  createOrUpdateMonthlyDecision: MonthlyDecisionPayload;
  createTenant: Tenant;
  createUser: UserPayload;
  deleteBuilding: SuccessPayload;
  deleteCity: SuccessPayload;
  deleteTenant: SuccessPayload;
  deleteUser: SuccessPayload;
  initializeMonthlyDecisions: BulkOperationPayload;
  login: LoginPayload;
  updateBuilding: Building;
  updateCity: City;
  updateMonthlyDecision: MonthlyDecisionPayload;
  updateTenant: Tenant;
  updateUser: UserPayload;
};


export type MutationAddBuildingEntryArgs = {
  buildingId: Scalars['UUID']['input'];
  entryName: Scalars['String']['input'];
};


export type MutationAdminResetUserPasswordByEmailArgs = {
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationAssignBuildingAdminArgs = {
  input: AssignBuildingAdminInput;
};


export type MutationChangeMyPasswordArgs = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationCreateBuildingArgs = {
  input: CreateBuildingInput;
};


export type MutationCreateCityArgs = {
  input: CreateCityInput;
};


export type MutationCreateMultipleTenantsArgs = {
  buildingEntryId: Scalars['UUID']['input'];
  tenantsInput: Array<CreateTenantInput>;
};


export type MutationCreateOrUpdateMonthlyDecisionArgs = {
  input: CreateMonthlyDecisionInput;
};


export type MutationCreateTenantArgs = {
  input: CreateSingleTenantInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteBuildingArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationDeleteCityArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationDeleteTenantArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationInitializeMonthlyDecisionsArgs = {
  decidedByUserId: Scalars['UUID']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationUpdateBuildingArgs = {
  input: UpdateBuildingInput;
};


export type MutationUpdateCityArgs = {
  input: UpdateCityInput;
};


export type MutationUpdateMonthlyDecisionArgs = {
  input: UpdateMonthlyDecisionInput;
};


export type MutationUpdateTenantArgs = {
  input: UpdateTenantInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  adminsInMyBuildings: Array<User>;
  allAdmins: Array<User>;
  allBuildings: Array<Building>;
  buildingById?: Maybe<Building>;
  buildings: Array<Building>;
  buildingsByCity: Array<Building>;
  cities: Array<City>;
  citiesByCode: Array<City>;
  citiesWithStats: Array<CityWithStats>;
  cityById?: Maybe<City>;
  currentMonthDecisions: Array<TenantDecisionStatus>;
  monthlyDecisions: Array<MonthlyDecision>;
  myBuildings: Array<Building>;
  myBuildingsWithStats: Array<BuildingWithStats>;
  myCities: Array<City>;
  myDecisionStats: DecisionStats;
  myPendingDecisions: Array<TenantDecisionStatus>;
  myPendingTenants: Array<Tenant>;
  myProfile?: Maybe<User>;
  myTenants: Array<Tenant>;
  myTenantsWithDecisionStatus: Array<TenantWithDecisionStatus>;
  pendingDecisions: Array<TenantDecisionStatus>;
  searchTenants: Array<Tenant>;
  searchUsers: Array<User>;
  tenantById?: Maybe<Tenant>;
  tenantDecisionHistory: Array<MonthlyDecision>;
  tenants: Array<Tenant>;
  tenantsByBuilding: Array<Tenant>;
  tenantsByBuildingEntry: Array<Tenant>;
  userById?: Maybe<User>;
  userStats: UserStats;
  users: Array<User>;
  usersInMyBuildings: Array<User>;
};


export type QueryBuildingByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryBuildingsArgs = {
  order?: InputMaybe<Array<BuildingSortInput>>;
  where?: InputMaybe<BuildingFilterInput>;
};


export type QueryBuildingsByCityArgs = {
  cityId: Scalars['UUID']['input'];
};


export type QueryCitiesArgs = {
  order?: InputMaybe<Array<CitySortInput>>;
  where?: InputMaybe<CityFilterInput>;
};


export type QueryCitiesByCodeArgs = {
  code: Scalars['String']['input'];
};


export type QueryCityByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryCurrentMonthDecisionsArgs = {
  buildingId?: InputMaybe<Scalars['UUID']['input']>;
};


export type QueryMonthlyDecisionsArgs = {
  order?: InputMaybe<Array<MonthlyDecisionSortInput>>;
  where?: InputMaybe<MonthlyDecisionFilterInput>;
};


export type QueryPendingDecisionsArgs = {
  buildingId?: InputMaybe<Scalars['UUID']['input']>;
};


export type QuerySearchTenantsArgs = {
  searchTerm: Scalars['String']['input'];
};


export type QuerySearchUsersArgs = {
  searchTerm: Scalars['String']['input'];
};


export type QueryTenantByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryTenantDecisionHistoryArgs = {
  tenantId: Scalars['UUID']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTenantsArgs = {
  order?: InputMaybe<Array<TenantSortInput>>;
  where?: InputMaybe<TenantFilterInput>;
};


export type QueryTenantsByBuildingArgs = {
  buildingId: Scalars['UUID']['input'];
};


export type QueryTenantsByBuildingEntryArgs = {
  buildingEntryId: Scalars['UUID']['input'];
};


export type QueryUserByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryUsersArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ncontains?: InputMaybe<Scalars['String']['input']>;
  nendsWith?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nstartsWith?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type SuccessPayload = {
  __typename?: 'SuccessPayload';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Tenant = {
  __typename?: 'Tenant';
  buildingEntry: BuildingEntry;
  buildingEntryId: Scalars['UUID']['output'];
  contactEmail: Scalars['String']['output'];
  contactPhone: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  monthlyDecisions: Array<MonthlyDecision>;
  name: Scalars['String']['output'];
  unitNumber: Scalars['String']['output'];
};

export type TenantDecisionStatus = {
  __typename?: 'TenantDecisionStatus';
  buildingName: Scalars['String']['output'];
  cityName: Scalars['String']['output'];
  currentMonthDecision?: Maybe<MonthlyDecision>;
  entryName: Scalars['String']['output'];
  lastDecision?: Maybe<MonthlyDecision>;
  tenantId: Scalars['UUID']['output'];
  tenantName: Scalars['String']['output'];
  unitNumber: Scalars['String']['output'];
};

export type TenantFilterInput = {
  and?: InputMaybe<Array<TenantFilterInput>>;
  buildingEntry?: InputMaybe<BuildingEntryFilterInput>;
  buildingEntryId?: InputMaybe<UuidOperationFilterInput>;
  contactEmail?: InputMaybe<StringOperationFilterInput>;
  contactPhone?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  monthlyDecisions?: InputMaybe<ListFilterInputTypeOfMonthlyDecisionFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<TenantFilterInput>>;
  unitNumber?: InputMaybe<StringOperationFilterInput>;
};

export type TenantSortInput = {
  buildingEntry?: InputMaybe<BuildingEntrySortInput>;
  buildingEntryId?: InputMaybe<SortEnumType>;
  contactEmail?: InputMaybe<SortEnumType>;
  contactPhone?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  unitNumber?: InputMaybe<SortEnumType>;
};

export type TenantWithDecisionStatus = {
  __typename?: 'TenantWithDecisionStatus';
  buildingName: Scalars['String']['output'];
  cityName: Scalars['String']['output'];
  contactEmail: Scalars['String']['output'];
  contactPhone: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  currentMonthDecision?: Maybe<MonthlyDecision>;
  entryName: Scalars['String']['output'];
  hasPendingDecision: Scalars['Boolean']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  unitNumber: Scalars['String']['output'];
};

export type UpdateBuildingInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  cityId?: InputMaybe<Scalars['UUID']['input']>;
  id: Scalars['UUID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCityInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMonthlyDecisionInput = {
  id: Scalars['UUID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<DecisionStatus>;
};

export type UpdateTenantInput = {
  buildingEntryId?: InputMaybe<Scalars['UUID']['input']>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  unitNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  managedBuildings: Array<Building>;
  monthlyDecisions: Array<MonthlyDecision>;
  passwordHash: Scalars['String']['output'];
  passwordResetToken?: Maybe<Scalars['String']['output']>;
  passwordResetTokenExpiry?: Maybe<Scalars['DateTime']['output']>;
  role: UserRole;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserFilterInput = {
  and?: InputMaybe<Array<UserFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  firstName?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  lastName?: InputMaybe<StringOperationFilterInput>;
  managedBuildings?: InputMaybe<ListFilterInputTypeOfBuildingFilterInput>;
  monthlyDecisions?: InputMaybe<ListFilterInputTypeOfMonthlyDecisionFilterInput>;
  or?: InputMaybe<Array<UserFilterInput>>;
  passwordHash?: InputMaybe<StringOperationFilterInput>;
  passwordResetToken?: InputMaybe<StringOperationFilterInput>;
  passwordResetTokenExpiry?: InputMaybe<DateTimeOperationFilterInput>;
  role?: InputMaybe<UserRoleOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type UserPayload = {
  __typename?: 'UserPayload';
  token?: Maybe<Scalars['String']['output']>;
  user: User;
};

export enum UserRole {
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN'
}

export type UserRoleOperationFilterInput = {
  eq?: InputMaybe<UserRole>;
  in?: InputMaybe<Array<UserRole>>;
  neq?: InputMaybe<UserRole>;
  nin?: InputMaybe<Array<UserRole>>;
};

export type UserSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  firstName?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  lastName?: InputMaybe<SortEnumType>;
  passwordHash?: InputMaybe<SortEnumType>;
  passwordResetToken?: InputMaybe<SortEnumType>;
  passwordResetTokenExpiry?: InputMaybe<SortEnumType>;
  role?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export type UserStats = {
  __typename?: 'UserStats';
  currentUserRole: Scalars['String']['output'];
  myBuildingUsers: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
};

export type UuidOperationFilterInput = {
  eq?: InputMaybe<Scalars['UUID']['input']>;
  gt?: InputMaybe<Scalars['UUID']['input']>;
  gte?: InputMaybe<Scalars['UUID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  lt?: InputMaybe<Scalars['UUID']['input']>;
  lte?: InputMaybe<Scalars['UUID']['input']>;
  neq?: InputMaybe<Scalars['UUID']['input']>;
  ngt?: InputMaybe<Scalars['UUID']['input']>;
  ngte?: InputMaybe<Scalars['UUID']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  nlt?: InputMaybe<Scalars['UUID']['input']>;
  nlte?: InputMaybe<Scalars['UUID']['input']>;
};

export type GetAllAdminsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAdminsQuery = { __typename?: 'Query', allAdmins: Array<{ __typename?: 'User', createdAt: any, email?: string | null, firstName?: string | null, id: any, lastName?: string | null, passwordHash: string, passwordResetToken?: string | null, passwordResetTokenExpiry?: any | null, role: UserRole, updatedAt?: any | null }> };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginPayload', token?: string | null, success: boolean, message: string, user?: { __typename?: 'User', id: any, email?: string | null, firstName?: string | null, lastName?: string | null, role: UserRole } | null } };

export const GetAllAdminsDocument = gql`
    query GetAllAdmins {
  allAdmins {
    createdAt
    email
    firstName
    id
    lastName
    passwordHash
    passwordResetToken
    passwordResetTokenExpiry
    role
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAllAdminsGQL extends Apollo.Query<GetAllAdminsQuery, GetAllAdminsQueryVariables> {
    override document = GetAllAdminsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    success
    message
    user {
      id
      email
      firstName
      lastName
      role
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginGQL extends Apollo.Mutation<LoginMutation, LoginMutationVariables> {
    override document = LoginDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }