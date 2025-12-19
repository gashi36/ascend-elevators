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
  /** The `Decimal` scalar type represents a decimal floating-point number. */
  Decimal: { input: any; output: any; }
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

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
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
  buildingId: Scalars['UUID']['input'];
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

export type DecimalOperationFilterInput = {
  eq?: InputMaybe<Scalars['Decimal']['input']>;
  gt?: InputMaybe<Scalars['Decimal']['input']>;
  gte?: InputMaybe<Scalars['Decimal']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Decimal']['input']>>>;
  lt?: InputMaybe<Scalars['Decimal']['input']>;
  lte?: InputMaybe<Scalars['Decimal']['input']>;
  neq?: InputMaybe<Scalars['Decimal']['input']>;
  ngt?: InputMaybe<Scalars['Decimal']['input']>;
  ngte?: InputMaybe<Scalars['Decimal']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Decimal']['input']>>>;
  nlt?: InputMaybe<Scalars['Decimal']['input']>;
  nlte?: InputMaybe<Scalars['Decimal']['input']>;
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

/** A connection to a list of items. */
export type MyPendingTenantsConnection = {
  __typename?: 'MyPendingTenantsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<MyPendingTenantsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Tenant>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type MyPendingTenantsEdge = {
  __typename?: 'MyPendingTenantsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Tenant;
};

/** A connection to a list of items. */
export type MyTenantsConnection = {
  __typename?: 'MyTenantsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<MyTenantsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Tenant>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type MyTenantsEdge = {
  __typename?: 'MyTenantsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Tenant;
};

/** A connection to a list of items. */
export type MyTenantsWithDecisionStatusConnection = {
  __typename?: 'MyTenantsWithDecisionStatusConnection';
  /** A list of edges. */
  edges?: Maybe<Array<MyTenantsWithDecisionStatusEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<TenantWithDecisionStatus>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type MyTenantsWithDecisionStatusEdge = {
  __typename?: 'MyTenantsWithDecisionStatusEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: TenantWithDecisionStatus;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** Indicates whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicates whether more edges exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
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
  myPendingTenants?: Maybe<MyPendingTenantsConnection>;
  myProfile?: Maybe<User>;
  myTenants?: Maybe<MyTenantsConnection>;
  myTenantsWithDecisionStatus?: Maybe<MyTenantsWithDecisionStatusConnection>;
  pendingDecisions: Array<TenantDecisionStatus>;
  searchTenants?: Maybe<SearchTenantsConnection>;
  searchUsers: Array<User>;
  tenantDecisionHistory: Array<MonthlyDecision>;
  tenantStatistics: TenantStatistics;
  tenants?: Maybe<TenantsConnection>;
  tenantsByBuilding?: Maybe<TenantsByBuildingConnection>;
  tenantsByBuildingEntry?: Maybe<TenantsByBuildingEntryConnection>;
  tenantsWithEnhancedFilter?: Maybe<TenantsWithEnhancedFilterConnection>;
  userById?: Maybe<User>;
  userStats: UserStats;
  users?: Maybe<UsersConnection>;
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


export type QueryMyPendingTenantsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<TenantSortInput>>;
  where?: InputMaybe<TenantFilterInput>;
};


export type QueryMyTenantsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<TenantSortInput>>;
  where?: InputMaybe<TenantFilterInput>;
};


export type QueryMyTenantsWithDecisionStatusArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<TenantWithDecisionStatusSortInput>>;
  where?: InputMaybe<TenantWithDecisionStatusFilterInput>;
};


export type QueryPendingDecisionsArgs = {
  buildingId?: InputMaybe<Scalars['UUID']['input']>;
};


export type QuerySearchTenantsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<TenantSortInput>>;
  searchTerm: Scalars['String']['input'];
  where?: InputMaybe<TenantFilterInput>;
};


export type QuerySearchUsersArgs = {
  searchTerm: Scalars['String']['input'];
};


export type QueryTenantDecisionHistoryArgs = {
  tenantId: Scalars['UUID']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTenantStatisticsArgs = {
  buildingId?: InputMaybe<Scalars['UUID']['input']>;
  entryId?: InputMaybe<Scalars['UUID']['input']>;
};


export type QueryTenantsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<TenantSortInput>>;
  where?: InputMaybe<TenantFilterInput>;
};


export type QueryTenantsByBuildingArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  buildingId: Scalars['UUID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<TenantSortInput>>;
  where?: InputMaybe<TenantFilterInput>;
};


export type QueryTenantsByBuildingEntryArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  buildingEntryId: Scalars['UUID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<TenantSortInput>>;
  where?: InputMaybe<TenantFilterInput>;
};


export type QueryTenantsWithEnhancedFilterArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  buildingId?: InputMaybe<Scalars['UUID']['input']>;
  decisionStatus?: InputMaybe<DecisionStatus>;
  entryId?: InputMaybe<Scalars['UUID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hasPendingDecision?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<TenantWithDecisionStatusSortInput>>;
  search?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TenantWithDecisionStatusFilterInput>;
};


export type QueryUserByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};

/** A connection to a list of items. */
export type SearchTenantsConnection = {
  __typename?: 'SearchTenantsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<SearchTenantsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Tenant>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type SearchTenantsEdge = {
  __typename?: 'SearchTenantsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Tenant;
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
  buildingId: Scalars['UUID']['output'];
  contactEmail: Scalars['String']['output'];
  contactPhone: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  lastPaymentDate?: Maybe<Scalars['DateTime']['output']>;
  leaseEndDate?: Maybe<Scalars['DateTime']['output']>;
  leaseStartDate?: Maybe<Scalars['DateTime']['output']>;
  monthlyDecisions: Array<MonthlyDecision>;
  monthlyRent: Scalars['Decimal']['output'];
  name: Scalars['String']['output'];
  rentDueDayOfMonth: Scalars['Int']['output'];
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
  buildingId?: InputMaybe<UuidOperationFilterInput>;
  contactEmail?: InputMaybe<StringOperationFilterInput>;
  contactPhone?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  lastPaymentDate?: InputMaybe<DateTimeOperationFilterInput>;
  leaseEndDate?: InputMaybe<DateTimeOperationFilterInput>;
  leaseStartDate?: InputMaybe<DateTimeOperationFilterInput>;
  monthlyDecisions?: InputMaybe<ListFilterInputTypeOfMonthlyDecisionFilterInput>;
  monthlyRent?: InputMaybe<DecimalOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<TenantFilterInput>>;
  rentDueDayOfMonth?: InputMaybe<IntOperationFilterInput>;
  unitNumber?: InputMaybe<StringOperationFilterInput>;
};

export type TenantSortInput = {
  buildingEntry?: InputMaybe<BuildingEntrySortInput>;
  buildingEntryId?: InputMaybe<SortEnumType>;
  buildingId?: InputMaybe<SortEnumType>;
  contactEmail?: InputMaybe<SortEnumType>;
  contactPhone?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  lastPaymentDate?: InputMaybe<SortEnumType>;
  leaseEndDate?: InputMaybe<SortEnumType>;
  leaseStartDate?: InputMaybe<SortEnumType>;
  monthlyRent?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  rentDueDayOfMonth?: InputMaybe<SortEnumType>;
  unitNumber?: InputMaybe<SortEnumType>;
};

export type TenantStatistics = {
  __typename?: 'TenantStatistics';
  allowedDecisions: Scalars['Int']['output'];
  declinedDecisions: Scalars['Int']['output'];
  noDecision: Scalars['Int']['output'];
  pendingDecisions: Scalars['Int']['output'];
  totalTenants: Scalars['Int']['output'];
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

export type TenantWithDecisionStatusFilterInput = {
  and?: InputMaybe<Array<TenantWithDecisionStatusFilterInput>>;
  buildingName?: InputMaybe<StringOperationFilterInput>;
  cityName?: InputMaybe<StringOperationFilterInput>;
  contactEmail?: InputMaybe<StringOperationFilterInput>;
  contactPhone?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currentMonthDecision?: InputMaybe<MonthlyDecisionFilterInput>;
  entryName?: InputMaybe<StringOperationFilterInput>;
  hasPendingDecision?: InputMaybe<BooleanOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<TenantWithDecisionStatusFilterInput>>;
  unitNumber?: InputMaybe<StringOperationFilterInput>;
};

export type TenantWithDecisionStatusSortInput = {
  buildingName?: InputMaybe<SortEnumType>;
  cityName?: InputMaybe<SortEnumType>;
  contactEmail?: InputMaybe<SortEnumType>;
  contactPhone?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  currentMonthDecision?: InputMaybe<MonthlyDecisionSortInput>;
  entryName?: InputMaybe<SortEnumType>;
  hasPendingDecision?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  unitNumber?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type TenantsByBuildingConnection = {
  __typename?: 'TenantsByBuildingConnection';
  /** A list of edges. */
  edges?: Maybe<Array<TenantsByBuildingEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Tenant>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type TenantsByBuildingEdge = {
  __typename?: 'TenantsByBuildingEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Tenant;
};

/** A connection to a list of items. */
export type TenantsByBuildingEntryConnection = {
  __typename?: 'TenantsByBuildingEntryConnection';
  /** A list of edges. */
  edges?: Maybe<Array<TenantsByBuildingEntryEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Tenant>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type TenantsByBuildingEntryEdge = {
  __typename?: 'TenantsByBuildingEntryEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Tenant;
};

/** A connection to a list of items. */
export type TenantsConnection = {
  __typename?: 'TenantsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<TenantsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Tenant>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type TenantsEdge = {
  __typename?: 'TenantsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Tenant;
};

/** A connection to a list of items. */
export type TenantsWithEnhancedFilterConnection = {
  __typename?: 'TenantsWithEnhancedFilterConnection';
  /** A list of edges. */
  edges?: Maybe<Array<TenantsWithEnhancedFilterEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<TenantWithDecisionStatus>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type TenantsWithEnhancedFilterEdge = {
  __typename?: 'TenantsWithEnhancedFilterEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: TenantWithDecisionStatus;
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
  buildingId?: InputMaybe<Scalars['UUID']['input']>;
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

/** A connection to a list of items. */
export type UsersConnection = {
  __typename?: 'UsersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<UsersEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<User>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type UsersEdge = {
  __typename?: 'UsersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: User;
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

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginPayload', token?: string | null, success: boolean, message: string, user?: { __typename?: 'User', id: any, email?: string | null, firstName?: string | null, lastName?: string | null, role: UserRole } | null } };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'UserPayload', token?: string | null, user: { __typename?: 'User', id: any, email?: string | null, role: UserRole } } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UserPayload', token?: string | null, user: { __typename?: 'User', createdAt: any, email?: string | null, firstName?: string | null, id: any, lastName?: string | null, role: UserRole, updatedAt?: any | null } } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: { __typename?: 'SuccessPayload', message: string, success: boolean } };

export type ChangeMyPasswordMutationVariables = Exact<{
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ChangeMyPasswordMutation = { __typename?: 'Mutation', changeMyPassword: { __typename?: 'SuccessPayload', message: string, success: boolean } };

export type CreateOrUpdateMonthlyDecisionMutationVariables = Exact<{
  input: CreateMonthlyDecisionInput;
}>;


export type CreateOrUpdateMonthlyDecisionMutation = { __typename?: 'Mutation', createOrUpdateMonthlyDecision: { __typename?: 'MonthlyDecisionPayload', message: string, decision: { __typename?: 'MonthlyDecision', id: any, year: number, month: number, status: DecisionStatus, notes: string, decisionDate: any, tenantId: any, decidedByUserId: any } } };

export type CreateTenantMutationVariables = Exact<{
  buildingEntryId: Scalars['UUID']['input'];
  buildingId: Scalars['UUID']['input'];
  contactEmail: Scalars['String']['input'];
  contactPhone: Scalars['String']['input'];
  name: Scalars['String']['input'];
  unitNumber: Scalars['String']['input'];
}>;


export type CreateTenantMutation = { __typename?: 'Mutation', createTenant: { __typename?: 'Tenant', id: any, name: string, contactEmail: string, contactPhone: string, unitNumber: string, buildingEntry: { __typename?: 'BuildingEntry', buildingId: any, createdAt: any, id: any, name: string } } };

export type GetAllUsersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllUsersQuery = { __typename?: 'Query', users?: { __typename?: 'UsersConnection', nodes?: Array<{ __typename?: 'User', id: any, email?: string | null, firstName?: string | null, lastName?: string | null, role: UserRole, createdAt: any, updatedAt?: any | null }> | null, edges?: Array<{ __typename?: 'UsersEdge', cursor: string }> | null, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', userById?: { __typename?: 'User', createdAt: any, email?: string | null, firstName?: string | null, id: any, role: UserRole, updatedAt?: any | null, managedBuildings: Array<{ __typename?: 'Building', address: string, cityId: any, createdAt: any, id: any, name: string, city: { __typename?: 'City', code: string, createdAt: any, id: any, name: string }, entries: Array<{ __typename?: 'BuildingEntry', buildingId: any, createdAt: any, id: any, name: string }> }> } | null };

export type GetBuildingByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetBuildingByIdQuery = { __typename?: 'Query', buildingById?: { __typename?: 'Building', address: string, createdAt: any, id: any, name: string, city: { __typename?: 'City', code: string, createdAt: any, id: any, name: string }, administrators: Array<{ __typename?: 'User', createdAt: any, email?: string | null, firstName?: string | null, id: any, lastName?: string | null, role: UserRole, updatedAt?: any | null }>, entries: Array<{ __typename?: 'BuildingEntry', buildingId: any, createdAt: any, id: any, name: string, tenants: Array<{ __typename?: 'Tenant', buildingEntryId: any, contactEmail: string, contactPhone: string, createdAt: any, id: any, name: string, unitNumber: string, monthlyDecisions: Array<{ __typename?: 'MonthlyDecision', decidedByUserId: any, decisionDate: any, id: any, month: number, status: DecisionStatus, tenantId: any, year: number, decidedByUser: { __typename?: 'User', firstName?: string | null, id: any, lastName?: string | null, role: UserRole } }> }> }> } | null };

export type TenantsByBuildingEntryQueryVariables = Exact<{
  buildingEntryId: Scalars['UUID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<TenantSortInput> | TenantSortInput>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type TenantsByBuildingEntryQuery = { __typename?: 'Query', tenantsByBuildingEntry?: { __typename?: 'TenantsByBuildingEntryConnection', totalCount: number, nodes?: Array<{ __typename?: 'Tenant', buildingEntryId: any, contactEmail: string, contactPhone: string, createdAt: any, id: any, lastPaymentDate?: any | null, leaseEndDate?: any | null, leaseStartDate?: any | null, monthlyRent: any, name: string, rentDueDayOfMonth: number, unitNumber: string, monthlyDecisions: Array<{ __typename?: 'MonthlyDecision', decidedByUserId: any, decisionDate: any, id: any, month: number, status: DecisionStatus, tenantId: any, year: number }> }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetAllTenantsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<TenantSortInput> | TenantSortInput>;
}>;


export type GetAllTenantsQuery = { __typename?: 'Query', tenants?: { __typename?: 'TenantsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null }, nodes?: Array<{ __typename?: 'Tenant', buildingEntryId: any, contactEmail: string, contactPhone: string, createdAt: any, id: any, lastPaymentDate?: any | null, leaseEndDate?: any | null, leaseStartDate?: any | null, monthlyRent: any, name: string, rentDueDayOfMonth: number, unitNumber: string, buildingEntry: { __typename?: 'BuildingEntry', id: any, name: string, createdAt: any, building: { __typename?: 'Building', address: string, cityId: any, createdAt: any, id: any, name: string, administrators: Array<{ __typename?: 'User', createdAt: any, email?: string | null, firstName?: string | null, id: any, lastName?: string | null, role: UserRole, updatedAt?: any | null }>, city: { __typename?: 'City', id: any, name: string, code: string } } }, monthlyDecisions: Array<{ __typename?: 'MonthlyDecision', decidedByUserId: any, decisionDate: any, id: any, month: number, notes: string, status: DecisionStatus, tenantId: any, year: number }> }> | null } | null };

export type GetBuildingsWithEntriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBuildingsWithEntriesQuery = { __typename?: 'Query', buildings: Array<{ __typename?: 'Building', id: any, name: string, address: string, city: { __typename?: 'City', name: string, code: string }, entries: Array<{ __typename?: 'BuildingEntry', id: any, name: string, buildingId: any }> }> };

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
export const CreateUserDocument = gql`
    mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    token
    user {
      id
      email
      role
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateUserGQL extends Apollo.Mutation<CreateUserMutation, CreateUserMutationVariables> {
    override document = CreateUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    token
    user {
      createdAt
      email
      firstName
      id
      lastName
      role
      updatedAt
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateUserGQL extends Apollo.Mutation<UpdateUserMutation, UpdateUserMutationVariables> {
    override document = UpdateUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: UUID!) {
  deleteUser(id: $id) {
    message
    success
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteUserGQL extends Apollo.Mutation<DeleteUserMutation, DeleteUserMutationVariables> {
    override document = DeleteUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ChangeMyPasswordDocument = gql`
    mutation ChangeMyPassword($currentPassword: String!, $newPassword: String!) {
  changeMyPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
    message
    success
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ChangeMyPasswordGQL extends Apollo.Mutation<ChangeMyPasswordMutation, ChangeMyPasswordMutationVariables> {
    override document = ChangeMyPasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOrUpdateMonthlyDecisionDocument = gql`
    mutation createOrUpdateMonthlyDecision($input: CreateMonthlyDecisionInput!) {
  createOrUpdateMonthlyDecision(input: $input) {
    message
    decision {
      id
      year
      month
      status
      notes
      decisionDate
      tenantId
      decidedByUserId
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOrUpdateMonthlyDecisionGQL extends Apollo.Mutation<CreateOrUpdateMonthlyDecisionMutation, CreateOrUpdateMonthlyDecisionMutationVariables> {
    override document = CreateOrUpdateMonthlyDecisionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateTenantDocument = gql`
    mutation CreateTenant($buildingEntryId: UUID!, $buildingId: UUID!, $contactEmail: String!, $contactPhone: String!, $name: String!, $unitNumber: String!) {
  createTenant(
    input: {buildingEntryId: $buildingEntryId, buildingId: $buildingId, contactEmail: $contactEmail, contactPhone: $contactPhone, name: $name, unitNumber: $unitNumber}
  ) {
    buildingEntry {
      buildingId
      createdAt
      id
      name
    }
    id
    name
    contactEmail
    contactPhone
    unitNumber
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateTenantGQL extends Apollo.Mutation<CreateTenantMutation, CreateTenantMutationVariables> {
    override document = CreateTenantDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAllUsersDocument = gql`
    query GetAllUsers($first: Int = 20, $after: String, $firstName: String = "") {
  users(
    order: {createdAt: DESC}
    where: {firstName: {startsWith: $firstName}}
    first: $first
    after: $after
  ) {
    nodes {
      id
      email
      firstName
      lastName
      role
      createdAt
      updatedAt
    }
    edges {
      cursor
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAllUsersGQL extends Apollo.Query<GetAllUsersQuery, GetAllUsersQueryVariables> {
    override document = GetAllUsersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUserByIdDocument = gql`
    query GetUserById($id: UUID!) {
  userById(id: $id) {
    createdAt
    email
    firstName
    id
    role
    updatedAt
    managedBuildings {
      address
      cityId
      createdAt
      id
      name
      city {
        code
        createdAt
        id
        name
      }
      entries {
        buildingId
        createdAt
        id
        name
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetUserByIdGQL extends Apollo.Query<GetUserByIdQuery, GetUserByIdQueryVariables> {
    override document = GetUserByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetBuildingByIdDocument = gql`
    query GetBuildingById($id: UUID!) {
  buildingById(id: $id) {
    address
    createdAt
    id
    name
    city {
      code
      createdAt
      id
      name
    }
    administrators {
      createdAt
      email
      firstName
      id
      lastName
      role
      updatedAt
    }
    entries {
      buildingId
      createdAt
      id
      name
      tenants {
        buildingEntryId
        contactEmail
        contactPhone
        createdAt
        id
        name
        unitNumber
        monthlyDecisions {
          decidedByUserId
          decisionDate
          id
          month
          status
          tenantId
          year
          decidedByUser {
            firstName
            id
            lastName
            role
          }
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetBuildingByIdGQL extends Apollo.Query<GetBuildingByIdQuery, GetBuildingByIdQueryVariables> {
    override document = GetBuildingByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const TenantsByBuildingEntryDocument = gql`
    query TenantsByBuildingEntry($buildingEntryId: UUID!, $search: String, $first: Int, $order: [TenantSortInput!], $after: String) {
  tenantsByBuildingEntry(
    buildingEntryId: $buildingEntryId
    where: {name: {startsWith: $search}}
    first: $first
    order: $order
    after: $after
  ) {
    totalCount
    nodes {
      buildingEntryId
      contactEmail
      contactPhone
      createdAt
      id
      lastPaymentDate
      leaseEndDate
      leaseStartDate
      monthlyRent
      name
      rentDueDayOfMonth
      unitNumber
      monthlyDecisions {
        decidedByUserId
        decisionDate
        id
        month
        status
        tenantId
        year
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class TenantsByBuildingEntryGQL extends Apollo.Query<TenantsByBuildingEntryQuery, TenantsByBuildingEntryQueryVariables> {
    override document = TenantsByBuildingEntryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAllTenantsDocument = gql`
    query GetAllTenants($first: Int, $after: String, $search: String, $order: [TenantSortInput!]) {
  tenants(
    first: $first
    after: $after
    where: {name: {startsWith: $search}}
    order: $order
  ) {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    nodes {
      buildingEntryId
      contactEmail
      contactPhone
      createdAt
      id
      lastPaymentDate
      leaseEndDate
      leaseStartDate
      monthlyRent
      name
      rentDueDayOfMonth
      unitNumber
      buildingEntry {
        id
        name
        createdAt
        building {
          address
          cityId
          createdAt
          id
          name
          administrators {
            createdAt
            email
            firstName
            id
            lastName
            role
            updatedAt
          }
          city {
            id
            name
            code
          }
        }
      }
      monthlyDecisions {
        decidedByUserId
        decisionDate
        id
        month
        notes
        status
        tenantId
        year
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAllTenantsGQL extends Apollo.Query<GetAllTenantsQuery, GetAllTenantsQueryVariables> {
    override document = GetAllTenantsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetBuildingsWithEntriesDocument = gql`
    query GetBuildingsWithEntries {
  buildings {
    id
    name
    address
    city {
      name
      code
    }
    entries {
      id
      name
      buildingId
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetBuildingsWithEntriesGQL extends Apollo.Query<GetBuildingsWithEntriesQuery, GetBuildingsWithEntriesQueryVariables> {
    override document = GetBuildingsWithEntriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }