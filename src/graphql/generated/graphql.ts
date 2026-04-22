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
  /** The `Byte` scalar type represents non-fractional whole numeric values. Byte can represent values between 0 and 255. */
  Byte: { input: any; output: any; }
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export type AdminResetPasswordInput = {
  newPassword: Scalars['String']['input'];
  userId: Scalars['UUID']['input'];
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

export type AuthPayload = {
  __typename?: 'AuthPayload';
  errors?: Maybe<Array<UserError>>;
  isSuccess: Scalars['Boolean']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Building = {
  __typename?: 'Building';
  address: Scalars['String']['output'];
  admin: User;
  adminId: Scalars['UUID']['output'];
  administrators: Array<User>;
  city: CityEnum;
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  entries: Array<BuildingEntry>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  tenants: Array<Tenant>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<Scalars['String']['output']>;
};

/** A connection to a list of items. */
export type BuildingEntriesByBuildingConnection = {
  __typename?: 'BuildingEntriesByBuildingConnection';
  /** A list of edges. */
  edges?: Maybe<Array<BuildingEntriesByBuildingEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<BuildingEntry>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type BuildingEntriesByBuildingEdge = {
  __typename?: 'BuildingEntriesByBuildingEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: BuildingEntry;
};

/** A connection to a list of items. */
export type BuildingEntriesConnection = {
  __typename?: 'BuildingEntriesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<BuildingEntriesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<BuildingEntry>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type BuildingEntriesEdge = {
  __typename?: 'BuildingEntriesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: BuildingEntry;
};

export type BuildingEntry = {
  __typename?: 'BuildingEntry';
  adminId: Scalars['UUID']['output'];
  building: Building;
  buildingId: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  tenants: Array<Tenant>;
};

export type BuildingEntryFilterInput = {
  adminId?: InputMaybe<UuidOperationFilterInput>;
  and?: InputMaybe<Array<BuildingEntryFilterInput>>;
  building?: InputMaybe<BuildingFilterInput>;
  buildingId?: InputMaybe<UuidOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<BuildingEntryFilterInput>>;
  order?: InputMaybe<IntOperationFilterInput>;
  tenants?: InputMaybe<ListFilterInputTypeOfTenantFilterInput>;
};

export type BuildingEntrySortInput = {
  adminId?: InputMaybe<SortEnumType>;
  building?: InputMaybe<BuildingSortInput>;
  buildingId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  order?: InputMaybe<SortEnumType>;
};

export type BuildingFilterInput = {
  address?: InputMaybe<StringOperationFilterInput>;
  admin?: InputMaybe<UserFilterInput>;
  adminId?: InputMaybe<UuidOperationFilterInput>;
  administrators?: InputMaybe<ListFilterInputTypeOfUserFilterInput>;
  and?: InputMaybe<Array<BuildingFilterInput>>;
  city?: InputMaybe<CityEnumOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  createdBy?: InputMaybe<StringOperationFilterInput>;
  entries?: InputMaybe<ListFilterInputTypeOfBuildingEntryFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<BuildingFilterInput>>;
  tenants?: InputMaybe<ListFilterInputTypeOfTenantFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
};

export type BuildingSortInput = {
  address?: InputMaybe<SortEnumType>;
  admin?: InputMaybe<UserSortInput>;
  adminId?: InputMaybe<SortEnumType>;
  city?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  createdBy?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type BuildingsConnection = {
  __typename?: 'BuildingsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<BuildingsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Building>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type BuildingsEdge = {
  __typename?: 'BuildingsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Building;
};

export type ByteOperationFilterInput = {
  eq?: InputMaybe<Scalars['Byte']['input']>;
  gt?: InputMaybe<Scalars['Byte']['input']>;
  gte?: InputMaybe<Scalars['Byte']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Byte']['input']>>>;
  lt?: InputMaybe<Scalars['Byte']['input']>;
  lte?: InputMaybe<Scalars['Byte']['input']>;
  neq?: InputMaybe<Scalars['Byte']['input']>;
  ngt?: InputMaybe<Scalars['Byte']['input']>;
  ngte?: InputMaybe<Scalars['Byte']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Byte']['input']>>>;
  nlt?: InputMaybe<Scalars['Byte']['input']>;
  nlte?: InputMaybe<Scalars['Byte']['input']>;
};

export type ChangePasswordInput = {
  currentPassword?: InputMaybe<Scalars['String']['input']>;
  newPassword: Scalars['String']['input'];
};

export enum CityEnum {
  Decan = 'DECAN',
  Dragash = 'DRAGASH',
  Drenas = 'DRENAS',
  Ferizaj = 'FERIZAJ',
  Gjakova = 'GJAKOVA',
  Gjilan = 'GJILAN',
  Gracanica = 'GRACANICA',
  HaniIElezet = 'HANI_I_ELEZET',
  Istog = 'ISTOG',
  Junik = 'JUNIK',
  Kacanik = 'KACANIK',
  Kamenica = 'KAMENICA',
  Klina = 'KLINA',
  Klokot = 'KLOKOT',
  Lipjan = 'LIPJAN',
  Malisheva = 'MALISHEVA',
  Mamusha = 'MAMUSHA',
  Mitrovica = 'MITROVICA',
  NovoBrdo = 'NOVO_BRDO',
  Partesh = 'PARTESH',
  Peja = 'PEJA',
  Podujeva = 'PODUJEVA',
  Prishtina = 'PRISHTINA',
  Prizren = 'PRIZREN',
  Rahovec = 'RAHOVEC',
  Ranillug = 'RANILLUG',
  Shtime = 'SHTIME',
  Skenderaj = 'SKENDERAJ',
  Strpce = 'STRPCE',
  Suhareka = 'SUHAREKA',
  Viti = 'VITI',
  Vushtrria = 'VUSHTRRIA'
}

export type CityEnumOperationFilterInput = {
  eq?: InputMaybe<CityEnum>;
  in?: InputMaybe<Array<CityEnum>>;
  neq?: InputMaybe<CityEnum>;
  nin?: InputMaybe<Array<CityEnum>>;
};

export type CreateBuildingEntryInput = {
  buildingId: Scalars['UUID']['input'];
  name: Scalars['String']['input'];
};

export type CreateBuildingInput = {
  address: Scalars['String']['input'];
  adminId?: InputMaybe<Scalars['UUID']['input']>;
  city: CityEnum;
  entryNames: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateMonthlyDecisionInput = {
  clientTimestamp?: InputMaybe<Scalars['DateTime']['input']>;
  decisionDate?: InputMaybe<Scalars['DateTime']['input']>;
  deviceId?: InputMaybe<Scalars['String']['input']>;
  month: Scalars['Int']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  status: DecisionStatus;
  tenantId: Scalars['UUID']['input'];
  year: Scalars['Int']['input'];
};

export type CreateSingleTenantInput = {
  accessKeyNR: Scalars['String']['input'];
  buildingEntryId: Scalars['UUID']['input'];
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  contactPhone: Scalars['String']['input'];
  floor?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  unitNumber: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: UserRole;
  username: Scalars['String']['input'];
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

export type DecisionNote = {
  __typename?: 'DecisionNote';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  createdByUserId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  monthlyDecision: MonthlyDecision;
  monthlyDecisionId: Scalars['UUID']['output'];
};

export type DecisionNoteFilterInput = {
  and?: InputMaybe<Array<DecisionNoteFilterInput>>;
  content?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  createdBy?: InputMaybe<StringOperationFilterInput>;
  createdByUserId?: InputMaybe<UuidOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  monthlyDecision?: InputMaybe<MonthlyDecisionFilterInput>;
  monthlyDecisionId?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<DecisionNoteFilterInput>>;
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

export type ExportResult = {
  __typename?: 'ExportResult';
  base64Zip: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
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

export type ListByteOperationFilterInput = {
  all?: InputMaybe<ByteOperationFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ByteOperationFilterInput>;
  some?: InputMaybe<ByteOperationFilterInput>;
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

export type ListFilterInputTypeOfDecisionNoteFilterInput = {
  all?: InputMaybe<DecisionNoteFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<DecisionNoteFilterInput>;
  some?: InputMaybe<DecisionNoteFilterInput>;
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
  password: Scalars['String']['input'];
  rememberMe?: Scalars['Boolean']['input'];
  username: Scalars['String']['input'];
};

export type MonthlyDecision = {
  __typename?: 'MonthlyDecision';
  adminId: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  decidedByUser?: Maybe<User>;
  decidedByUserId?: Maybe<Scalars['UUID']['output']>;
  decisionDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['UUID']['output'];
  month: Scalars['Int']['output'];
  notes: Array<DecisionNote>;
  rowVersion: Array<Scalars['Byte']['output']>;
  status: DecisionStatus;
  tenant: Tenant;
  tenantId: Scalars['UUID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  year: Scalars['Int']['output'];
};

export type MonthlyDecisionFilterInput = {
  adminId?: InputMaybe<UuidOperationFilterInput>;
  and?: InputMaybe<Array<MonthlyDecisionFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  decidedByUser?: InputMaybe<UserFilterInput>;
  decidedByUserId?: InputMaybe<UuidOperationFilterInput>;
  decisionDate?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  month?: InputMaybe<IntOperationFilterInput>;
  notes?: InputMaybe<ListFilterInputTypeOfDecisionNoteFilterInput>;
  or?: InputMaybe<Array<MonthlyDecisionFilterInput>>;
  rowVersion?: InputMaybe<ListByteOperationFilterInput>;
  status?: InputMaybe<DecisionStatusOperationFilterInput>;
  tenant?: InputMaybe<TenantFilterInput>;
  tenantId?: InputMaybe<UuidOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  year?: InputMaybe<IntOperationFilterInput>;
};

export type MonthlyDecisionSortInput = {
  adminId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  decidedByUser?: InputMaybe<UserSortInput>;
  decidedByUserId?: InputMaybe<SortEnumType>;
  decisionDate?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  month?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  tenant?: InputMaybe<TenantSortInput>;
  tenantId?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  year?: InputMaybe<SortEnumType>;
};

export type Mutation = {
  __typename?: 'Mutation';
  adminResetPassword?: Maybe<User>;
  assignBuildingAdmin: Scalars['Boolean']['output'];
  blockClient: User;
  canUserLogin: Scalars['Boolean']['output'];
  changePassword: Scalars['Boolean']['output'];
  createBuilding: Building;
  createBuildingEntry: BuildingEntry;
  createTenant: Tenant;
  createUser: User;
  deleteBuilding: Scalars['Boolean']['output'];
  deleteBuildingEntry: Scalars['Boolean']['output'];
  deleteTenant: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  exportAllEntriesToZip: ExportResult;
  login: AuthPayload;
  logout: Scalars['Boolean']['output'];
  refreshToken: AuthPayload;
  removeBuildingAdmin: Scalars['Boolean']['output'];
  setMonthlyStatus: MonthlyDecision;
  setupFirstSuperadmin: User;
  unblockClient: User;
  updateBuilding: Building;
  updateBuildingEntry: BuildingEntry;
  updateTenant: Tenant;
  updateUser?: Maybe<User>;
};


export type MutationAdminResetPasswordArgs = {
  input: AdminResetPasswordInput;
};


export type MutationAssignBuildingAdminArgs = {
  input: AssignBuildingAdminInput;
};


export type MutationBlockClientArgs = {
  clientId: Scalars['UUID']['input'];
};


export type MutationCanUserLoginArgs = {
  userId: Scalars['UUID']['input'];
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationCreateBuildingArgs = {
  input: CreateBuildingInput;
};


export type MutationCreateBuildingEntryArgs = {
  input: CreateBuildingEntryInput;
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


export type MutationDeleteBuildingEntryArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationDeleteTenantArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationExportAllEntriesToZipArgs = {
  year: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRemoveBuildingAdminArgs = {
  input: AssignBuildingAdminInput;
};


export type MutationSetMonthlyStatusArgs = {
  input: CreateMonthlyDecisionInput;
};


export type MutationSetupFirstSuperadminArgs = {
  input: CreateUserInput;
};


export type MutationUnblockClientArgs = {
  clientId: Scalars['UUID']['input'];
};


export type MutationUpdateBuildingArgs = {
  input: UpdateBuildingInput;
};


export type MutationUpdateBuildingEntryArgs = {
  input: UpdateBuildingEntryInput;
};


export type MutationUpdateTenantArgs = {
  input: UpdateTenantInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
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
  buildingById?: Maybe<Building>;
  buildingEntries?: Maybe<BuildingEntriesConnection>;
  buildingEntriesByBuilding?: Maybe<BuildingEntriesByBuildingConnection>;
  buildingEntryById?: Maybe<BuildingEntry>;
  buildings?: Maybe<BuildingsConnection>;
  health: Scalars['String']['output'];
  me?: Maybe<User>;
  tenantById?: Maybe<Tenant>;
  tenantDecisions: Array<MonthlyDecision>;
  tenantHistory?: Maybe<TenantHistoryConnection>;
  tenants?: Maybe<TenantsConnection>;
  tenantsWithDecisions?: Maybe<TenantsWithDecisionsConnection>;
  users?: Maybe<UsersConnection>;
};


export type QueryBuildingByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryBuildingEntriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<BuildingEntrySortInput>>;
  where?: InputMaybe<BuildingEntryFilterInput>;
};


export type QueryBuildingEntriesByBuildingArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  buildingId: Scalars['UUID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<BuildingEntrySortInput>>;
  where?: InputMaybe<BuildingEntryFilterInput>;
};


export type QueryBuildingEntryByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryBuildingsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<BuildingSortInput>>;
  where?: InputMaybe<BuildingFilterInput>;
};


export type QueryTenantByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryTenantDecisionsArgs = {
  tenantId: Scalars['UUID']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTenantHistoryArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<MonthlyDecisionSortInput>>;
  tenantId: Scalars['UUID']['input'];
  where?: InputMaybe<MonthlyDecisionFilterInput>;
};


export type QueryTenantsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  buildingId?: InputMaybe<Scalars['UUID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<TenantSortInput>>;
  where?: InputMaybe<TenantFilterInput>;
};


export type QueryTenantsWithDecisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<TenantSortInput>>;
  where?: InputMaybe<TenantFilterInput>;
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
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

export type Tenant = {
  __typename?: 'Tenant';
  accessKeyNR: Scalars['String']['output'];
  adminId: Scalars['UUID']['output'];
  buildingEntry: BuildingEntry;
  buildingEntryId: Scalars['UUID']['output'];
  contactEmail?: Maybe<Scalars['String']['output']>;
  contactPhone: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  floor?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  monthlyDecisions: Array<MonthlyDecision>;
  name: Scalars['String']['output'];
  unitNumber: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type TenantFilterInput = {
  accessKeyNR?: InputMaybe<StringOperationFilterInput>;
  adminId?: InputMaybe<UuidOperationFilterInput>;
  and?: InputMaybe<Array<TenantFilterInput>>;
  buildingEntry?: InputMaybe<BuildingEntryFilterInput>;
  buildingEntryId?: InputMaybe<UuidOperationFilterInput>;
  contactEmail?: InputMaybe<StringOperationFilterInput>;
  contactPhone?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  createdBy?: InputMaybe<StringOperationFilterInput>;
  floor?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  monthlyDecisions?: InputMaybe<ListFilterInputTypeOfMonthlyDecisionFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<TenantFilterInput>>;
  unitNumber?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
};

/** A connection to a list of items. */
export type TenantHistoryConnection = {
  __typename?: 'TenantHistoryConnection';
  /** A list of edges. */
  edges?: Maybe<Array<TenantHistoryEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<MonthlyDecision>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type TenantHistoryEdge = {
  __typename?: 'TenantHistoryEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: MonthlyDecision;
};

export type TenantSortInput = {
  accessKeyNR?: InputMaybe<SortEnumType>;
  adminId?: InputMaybe<SortEnumType>;
  buildingEntry?: InputMaybe<BuildingEntrySortInput>;
  buildingEntryId?: InputMaybe<SortEnumType>;
  contactEmail?: InputMaybe<SortEnumType>;
  contactPhone?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  createdBy?: InputMaybe<SortEnumType>;
  floor?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  unitNumber?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
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
export type TenantsWithDecisionsConnection = {
  __typename?: 'TenantsWithDecisionsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<TenantsWithDecisionsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Tenant>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type TenantsWithDecisionsEdge = {
  __typename?: 'TenantsWithDecisionsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Tenant;
};

export type UpdateBuildingEntryInput = {
  id: Scalars['UUID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateBuildingInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<CityEnum>;
  id: Scalars['UUID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTenantInput = {
  accessKeyNR?: InputMaybe<Scalars['String']['input']>;
  buildingEntryId?: InputMaybe<Scalars['UUID']['input']>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  floor?: InputMaybe<Scalars['String']['input']>;
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
  createdByAdmin?: Maybe<User>;
  createdByAdminId?: Maybe<Scalars['UUID']['output']>;
  createdManagers: Array<User>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isBlocked: Scalars['Boolean']['output'];
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  managedBuildings: Array<Building>;
  monthlyDecisions: Array<MonthlyDecision>;
  role: UserRole;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  username: Scalars['String']['output'];
};

export type UserError = {
  __typename?: 'UserError';
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type UserFilterInput = {
  and?: InputMaybe<Array<UserFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  createdByAdmin?: InputMaybe<UserFilterInput>;
  createdByAdminId?: InputMaybe<UuidOperationFilterInput>;
  createdManagers?: InputMaybe<ListFilterInputTypeOfUserFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  firstName?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  isBlocked?: InputMaybe<BooleanOperationFilterInput>;
  lastLoginAt?: InputMaybe<DateTimeOperationFilterInput>;
  lastName?: InputMaybe<StringOperationFilterInput>;
  managedBuildings?: InputMaybe<ListFilterInputTypeOfBuildingFilterInput>;
  monthlyDecisions?: InputMaybe<ListFilterInputTypeOfMonthlyDecisionFilterInput>;
  or?: InputMaybe<Array<UserFilterInput>>;
  role?: InputMaybe<UserRoleOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  username?: InputMaybe<StringOperationFilterInput>;
};

export enum UserRole {
  Admin = 'ADMIN',
  Manager = 'MANAGER',
  Superadmin = 'SUPERADMIN'
}

export type UserRoleOperationFilterInput = {
  eq?: InputMaybe<UserRole>;
  in?: InputMaybe<Array<UserRole>>;
  neq?: InputMaybe<UserRole>;
  nin?: InputMaybe<Array<UserRole>>;
};

export type UserSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  createdByAdmin?: InputMaybe<UserSortInput>;
  createdByAdminId?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  firstName?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isBlocked?: InputMaybe<SortEnumType>;
  lastLoginAt?: InputMaybe<SortEnumType>;
  lastName?: InputMaybe<SortEnumType>;
  role?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  username?: InputMaybe<SortEnumType>;
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
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
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
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
  rememberMe?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', token?: string | null, isSuccess: boolean, user?: { __typename?: 'User', id: any, username: string, email?: string | null, firstName?: string | null, lastName?: string | null, role: UserRole, isBlocked: boolean, createdAt: any, createdByAdminId?: any | null } | null, errors?: Array<{ __typename?: 'UserError', message: string, code: string }> | null } };

export type SetupFirstSuperadminMutationVariables = Exact<{
  username: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
}>;


export type SetupFirstSuperadminMutation = { __typename?: 'Mutation', setupFirstSuperadmin: { __typename?: 'User', id: any, username: string, role: UserRole } };

export type CreateUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  role: UserRole;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: any, username: string, email?: string | null, firstName?: string | null, lastName?: string | null, role: UserRole, createdAt: any, createdByAdminId?: any | null } };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'User', id: any, username: string, email?: string | null, firstName?: string | null, lastName?: string | null, role: UserRole, updatedAt?: any | null } | null };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

export type ChangePasswordMutationVariables = Exact<{
  currentPassword?: InputMaybe<Scalars['String']['input']>;
  newPassword: Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type AdminResetPasswordMutationVariables = Exact<{
  userId: Scalars['UUID']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type AdminResetPasswordMutation = { __typename?: 'Mutation', adminResetPassword?: { __typename?: 'User', id: any, username: string, updatedAt?: any | null } | null };

export type BlockClientMutationVariables = Exact<{
  clientId: Scalars['UUID']['input'];
}>;


export type BlockClientMutation = { __typename?: 'Mutation', blockClient: { __typename?: 'User', id: any, username: string, isBlocked: boolean, updatedAt?: any | null } };

export type UnblockClientMutationVariables = Exact<{
  clientId: Scalars['UUID']['input'];
}>;


export type UnblockClientMutation = { __typename?: 'Mutation', unblockClient: { __typename?: 'User', id: any, username: string, isBlocked: boolean, updatedAt?: any | null } };

export type CreateBuildingMutationVariables = Exact<{
  name: Scalars['String']['input'];
  address: Scalars['String']['input'];
  city: CityEnum;
  entryNames: Array<Scalars['String']['input']> | Scalars['String']['input'];
  adminId?: InputMaybe<Scalars['UUID']['input']>;
}>;


export type CreateBuildingMutation = { __typename?: 'Mutation', createBuilding: { __typename?: 'Building', id: any, name: string, address: string, city: CityEnum, adminId: any, createdAt: any, admin: { __typename?: 'User', id: any, username: string, firstName?: string | null, lastName?: string | null }, entries: Array<{ __typename?: 'BuildingEntry', id: any, name: string, order: number }> } };

export type UpdateBuildingMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<CityEnum>;
}>;


export type UpdateBuildingMutation = { __typename?: 'Mutation', updateBuilding: { __typename?: 'Building', id: any, name: string, address: string, city: CityEnum, updatedAt?: any | null } };

export type DeleteBuildingMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type DeleteBuildingMutation = { __typename?: 'Mutation', deleteBuilding: boolean };

export type AssignBuildingAdminMutationVariables = Exact<{
  buildingId: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
}>;


export type AssignBuildingAdminMutation = { __typename?: 'Mutation', assignBuildingAdmin: boolean };

export type RemoveBuildingAdminMutationVariables = Exact<{
  buildingId: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
}>;


export type RemoveBuildingAdminMutation = { __typename?: 'Mutation', removeBuildingAdmin: boolean };

export type CreateBuildingEntryMutationVariables = Exact<{
  name: Scalars['String']['input'];
  buildingId: Scalars['UUID']['input'];
}>;


export type CreateBuildingEntryMutation = { __typename?: 'Mutation', createBuildingEntry: { __typename?: 'BuildingEntry', id: any, name: string, order: number, buildingId: any, adminId: any, createdAt: any } };

export type UpdateBuildingEntryMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  name: Scalars['String']['input'];
}>;


export type UpdateBuildingEntryMutation = { __typename?: 'Mutation', updateBuildingEntry: { __typename?: 'BuildingEntry', id: any, name: string, updatedAt: any } };

export type DeleteBuildingEntryMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type DeleteBuildingEntryMutation = { __typename?: 'Mutation', deleteBuildingEntry: boolean };

export type CreateTenantMutationVariables = Exact<{
  name: Scalars['String']['input'];
  contactPhone: Scalars['String']['input'];
  unitNumber: Scalars['String']['input'];
  buildingEntryId: Scalars['UUID']['input'];
  accessKeyNR: Scalars['String']['input'];
  floor?: InputMaybe<Scalars['String']['input']>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateTenantMutation = { __typename?: 'Mutation', createTenant: { __typename?: 'Tenant', id: any, name: string, unitNumber: string, floor?: string | null, contactEmail?: string | null, contactPhone: string, accessKeyNR: string, buildingEntryId: any, adminId: any, createdAt: any, buildingEntry: { __typename?: 'BuildingEntry', id: any, name: string } } };

export type UpdateTenantMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  unitNumber?: InputMaybe<Scalars['String']['input']>;
  buildingEntryId?: InputMaybe<Scalars['UUID']['input']>;
  floor?: InputMaybe<Scalars['String']['input']>;
  accessKeyNR?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateTenantMutation = { __typename?: 'Mutation', updateTenant: { __typename?: 'Tenant', id: any, name: string, unitNumber: string, floor?: string | null, contactEmail?: string | null, contactPhone: string, accessKeyNR: string, updatedAt?: any | null } };

export type DeleteTenantMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type DeleteTenantMutation = { __typename?: 'Mutation', deleteTenant: boolean };

export type SetMonthlyStatusMutationVariables = Exact<{
  tenantId: Scalars['UUID']['input'];
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
  status: DecisionStatus;
  note?: InputMaybe<Scalars['String']['input']>;
  deviceId?: InputMaybe<Scalars['String']['input']>;
  clientTimestamp?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type SetMonthlyStatusMutation = { __typename?: 'Mutation', setMonthlyStatus: { __typename?: 'MonthlyDecision', id: any, tenantId: any, year: number, month: number, status: DecisionStatus, decidedByUserId?: any | null, decisionDate?: any | null, updatedAt: any, notes: Array<{ __typename?: 'DecisionNote', id: any, content: string, createdBy: string, createdByUserId: any, createdAt: any }> } };

export type ExportAllEntriesToZipMutationVariables = Exact<{
  year: Scalars['Int']['input'];
}>;


export type ExportAllEntriesToZipMutation = { __typename?: 'Mutation', exportAllEntriesToZip: { __typename?: 'ExportResult', base64Zip: string, fileName: string } };

export type HealthQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthQuery = { __typename?: 'Query', health: string };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: any, username: string, email?: string | null, firstName?: string | null, lastName?: string | null, role: UserRole, isBlocked: boolean, createdAt: any, createdByAdminId?: any | null, createdManagers: Array<{ __typename?: 'User', id: any, username: string, firstName?: string | null, lastName?: string | null, role: UserRole, isBlocked: boolean }>, managedBuildings: Array<{ __typename?: 'Building', id: any, name: string, city: CityEnum }> } | null };

export type GetUsersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<UserFilterInput>;
  order?: InputMaybe<Array<UserSortInput> | UserSortInput>;
}>;


export type GetUsersQuery = { __typename?: 'Query', users?: { __typename?: 'UsersConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges?: Array<{ __typename?: 'UsersEdge', cursor: string, node: { __typename?: 'User', id: any, username: string, email?: string | null, firstName?: string | null, lastName?: string | null, role: UserRole, isBlocked: boolean, createdAt: any, updatedAt?: any | null, createdByAdminId?: any | null, createdManagers: Array<{ __typename?: 'User', id: any, username: string, firstName?: string | null, lastName?: string | null, role: UserRole, isBlocked: boolean }> } }> | null } | null };

export type GetBuildingsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BuildingFilterInput>;
  order?: InputMaybe<Array<BuildingSortInput> | BuildingSortInput>;
}>;


export type GetBuildingsQuery = { __typename?: 'Query', buildings?: { __typename?: 'BuildingsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges?: Array<{ __typename?: 'BuildingsEdge', cursor: string, node: { __typename?: 'Building', id: any, name: string, address: string, city: CityEnum, adminId: any, createdAt: any, updatedAt?: any | null, admin: { __typename?: 'User', id: any, username: string, firstName?: string | null, lastName?: string | null }, entries: Array<{ __typename?: 'BuildingEntry', id: any, name: string, order: number, adminId: any }>, administrators: Array<{ __typename?: 'User', id: any, username: string, firstName?: string | null, lastName?: string | null }> } }> | null } | null };

export type GetBuildingByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetBuildingByIdQuery = { __typename?: 'Query', buildingById?: { __typename?: 'Building', id: any, name: string, address: string, city: CityEnum, adminId: any, createdAt: any, updatedAt?: any | null, admin: { __typename?: 'User', id: any, username: string, firstName?: string | null, lastName?: string | null, email?: string | null }, entries: Array<{ __typename?: 'BuildingEntry', id: any, name: string, order: number, adminId: any, createdAt: any, tenants: Array<{ __typename?: 'Tenant', id: any, name: string, unitNumber: string, floor?: string | null, contactEmail?: string | null, contactPhone: string, accessKeyNR: string }> }>, administrators: Array<{ __typename?: 'User', id: any, username: string, firstName?: string | null, lastName?: string | null }>, tenants: Array<{ __typename?: 'Tenant', id: any, name: string, unitNumber: string, floor?: string | null, accessKeyNR: string }> } | null };

export type GetBuildingEntriesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BuildingEntryFilterInput>;
  order?: InputMaybe<Array<BuildingEntrySortInput> | BuildingEntrySortInput>;
}>;


export type GetBuildingEntriesQuery = { __typename?: 'Query', buildingEntries?: { __typename?: 'BuildingEntriesConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges?: Array<{ __typename?: 'BuildingEntriesEdge', cursor: string, node: { __typename?: 'BuildingEntry', id: any, name: string, order: number, buildingId: any, adminId: any, createdAt: any, building: { __typename?: 'Building', id: any, name: string, city: CityEnum } } }> | null } | null };

export type GetBuildingEntriesByBuildingQueryVariables = Exact<{
  buildingId: Scalars['UUID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetBuildingEntriesByBuildingQuery = { __typename?: 'Query', buildingEntriesByBuilding?: { __typename?: 'BuildingEntriesByBuildingConnection', totalCount: number, edges?: Array<{ __typename?: 'BuildingEntriesByBuildingEdge', node: { __typename?: 'BuildingEntry', id: any, name: string, order: number, buildingId: any, adminId: any, createdAt: any, tenants: Array<{ __typename?: 'Tenant', id: any, name: string, unitNumber: string, floor?: string | null, contactPhone: string, accessKeyNR: string }> } }> | null } | null };

export type GetBuildingEntryByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetBuildingEntryByIdQuery = { __typename?: 'Query', buildingEntryById?: { __typename?: 'BuildingEntry', id: any, name: string, order: number, buildingId: any, adminId: any, createdAt: any, building: { __typename?: 'Building', id: any, name: string, city: CityEnum, admin: { __typename?: 'User', id: any, firstName?: string | null, lastName?: string | null } }, tenants: Array<{ __typename?: 'Tenant', id: any, name: string, unitNumber: string, floor?: string | null, contactEmail?: string | null, contactPhone: string, accessKeyNR: string, monthlyDecisions: Array<{ __typename?: 'MonthlyDecision', id: any, year: number, month: number, status: DecisionStatus, updatedAt: any }> }> } | null };

export type GetTenantsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TenantFilterInput>;
  order?: InputMaybe<Array<TenantSortInput> | TenantSortInput>;
}>;


export type GetTenantsQuery = { __typename?: 'Query', tenants?: { __typename?: 'TenantsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges?: Array<{ __typename?: 'TenantsEdge', cursor: string, node: { __typename?: 'Tenant', id: any, name: string, unitNumber: string, floor?: string | null, contactEmail?: string | null, contactPhone: string, accessKeyNR: string, buildingEntryId: any, adminId: any, createdAt: any, updatedAt?: any | null, buildingEntry: { __typename?: 'BuildingEntry', id: any, name: string } } }> | null } | null };

export type GetTenantByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTenantByIdQuery = { __typename?: 'Query', tenantById?: { __typename?: 'Tenant', id: any, name: string, unitNumber: string, floor?: string | null, contactEmail?: string | null, contactPhone: string, accessKeyNR: string, buildingEntryId: any, adminId: any, createdAt: any, updatedAt?: any | null, buildingEntry: { __typename?: 'BuildingEntry', id: any, name: string, order: number }, monthlyDecisions: Array<{ __typename?: 'MonthlyDecision', id: any, year: number, month: number, status: DecisionStatus, decisionDate?: any | null, updatedAt: any, decidedByUserId?: any | null }> } | null };

export type GetTenantHistoryQueryVariables = Exact<{
  tenantId: Scalars['UUID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTenantHistoryQuery = { __typename?: 'Query', tenantHistory?: { __typename?: 'TenantHistoryConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges?: Array<{ __typename?: 'TenantHistoryEdge', cursor: string, node: { __typename?: 'MonthlyDecision', id: any, year: number, month: number, status: DecisionStatus, decisionDate?: any | null, decidedByUserId?: any | null, updatedAt: any } }> | null } | null };

export type GetTenantsWithDecisionsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TenantFilterInput>;
  order?: InputMaybe<Array<TenantSortInput> | TenantSortInput>;
  buildingId?: InputMaybe<Scalars['UUID']['input']>;
}>;


export type GetTenantsWithDecisionsQuery = { __typename?: 'Query', tenants?: { __typename?: 'TenantsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges?: Array<{ __typename?: 'TenantsEdge', cursor: string, node: { __typename?: 'Tenant', id: any, name: string, unitNumber: string, floor?: string | null, accessKeyNR: string, contactPhone: string, buildingEntryId: any, buildingEntry: { __typename?: 'BuildingEntry', id: any, name: string, building: { __typename?: 'Building', id: any, name: string, city: CityEnum } }, monthlyDecisions: Array<{ __typename?: 'MonthlyDecision', id: any, year: number, month: number, status: DecisionStatus, updatedAt: any, notes: Array<{ __typename?: 'DecisionNote', id: any, content: string, createdBy: string, createdByUserId: any, createdAt: any }> }> } }> | null } | null };

export type GetTenantDecisionsQueryVariables = Exact<{
  tenantId: Scalars['UUID']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetTenantDecisionsQuery = { __typename?: 'Query', tenantDecisions: Array<{ __typename?: 'MonthlyDecision', id: any, tenantId: any, year: number, month: number, status: DecisionStatus, decisionDate?: any | null, decidedByUserId?: any | null, updatedAt: any }> };

export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!, $rememberMe: Boolean) {
  login(
    input: {username: $username, password: $password, rememberMe: $rememberMe}
  ) {
    token
    isSuccess
    user {
      id
      username
      email
      firstName
      lastName
      role
      isBlocked
      createdAt
      createdByAdminId
    }
    errors {
      message
      code
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
export const SetupFirstSuperadminDocument = gql`
    mutation SetupFirstSuperadmin($username: String!, $email: String!, $password: String!, $firstName: String!, $lastName: String!) {
  setupFirstSuperadmin(
    input: {username: $username, email: $email, password: $password, firstName: $firstName, lastName: $lastName, role: ADMIN}
  ) {
    id
    username
    role
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SetupFirstSuperadminGQL extends Apollo.Mutation<SetupFirstSuperadminMutation, SetupFirstSuperadminMutationVariables> {
    override document = SetupFirstSuperadminDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateUserDocument = gql`
    mutation CreateUser($username: String!, $email: String!, $password: String!, $firstName: String!, $lastName: String!, $role: UserRole!) {
  createUser(
    input: {username: $username, email: $email, password: $password, firstName: $firstName, lastName: $lastName, role: $role}
  ) {
    id
    username
    email
    firstName
    lastName
    role
    createdAt
    createdByAdminId
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
    mutation UpdateUser($id: UUID!, $email: String, $firstName: String, $lastName: String, $role: UserRole) {
  updateUser(
    input: {id: $id, email: $email, firstName: $firstName, lastName: $lastName, role: $role}
  ) {
    id
    username
    email
    firstName
    lastName
    role
    updatedAt
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
  deleteUser(id: $id)
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
export const ChangePasswordDocument = gql`
    mutation ChangePassword($currentPassword: String, $newPassword: String!) {
  changePassword(
    input: {currentPassword: $currentPassword, newPassword: $newPassword}
  )
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ChangePasswordGQL extends Apollo.Mutation<ChangePasswordMutation, ChangePasswordMutationVariables> {
    override document = ChangePasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AdminResetPasswordDocument = gql`
    mutation AdminResetPassword($userId: UUID!, $newPassword: String!) {
  adminResetPassword(input: {userId: $userId, newPassword: $newPassword}) {
    id
    username
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AdminResetPasswordGQL extends Apollo.Mutation<AdminResetPasswordMutation, AdminResetPasswordMutationVariables> {
    override document = AdminResetPasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const BlockClientDocument = gql`
    mutation BlockClient($clientId: UUID!) {
  blockClient(clientId: $clientId) {
    id
    username
    isBlocked
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class BlockClientGQL extends Apollo.Mutation<BlockClientMutation, BlockClientMutationVariables> {
    override document = BlockClientDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UnblockClientDocument = gql`
    mutation UnblockClient($clientId: UUID!) {
  unblockClient(clientId: $clientId) {
    id
    username
    isBlocked
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UnblockClientGQL extends Apollo.Mutation<UnblockClientMutation, UnblockClientMutationVariables> {
    override document = UnblockClientDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateBuildingDocument = gql`
    mutation CreateBuilding($name: String!, $address: String!, $city: CityEnum!, $entryNames: [String!]!, $adminId: UUID) {
  createBuilding(
    input: {name: $name, address: $address, city: $city, entryNames: $entryNames, adminId: $adminId}
  ) {
    id
    name
    address
    city
    adminId
    createdAt
    admin {
      id
      username
      firstName
      lastName
    }
    entries {
      id
      name
      order
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateBuildingGQL extends Apollo.Mutation<CreateBuildingMutation, CreateBuildingMutationVariables> {
    override document = CreateBuildingDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateBuildingDocument = gql`
    mutation UpdateBuilding($id: UUID!, $name: String, $address: String, $city: CityEnum) {
  updateBuilding(input: {id: $id, name: $name, address: $address, city: $city}) {
    id
    name
    address
    city
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateBuildingGQL extends Apollo.Mutation<UpdateBuildingMutation, UpdateBuildingMutationVariables> {
    override document = UpdateBuildingDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteBuildingDocument = gql`
    mutation DeleteBuilding($id: UUID!) {
  deleteBuilding(id: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteBuildingGQL extends Apollo.Mutation<DeleteBuildingMutation, DeleteBuildingMutationVariables> {
    override document = DeleteBuildingDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AssignBuildingAdminDocument = gql`
    mutation AssignBuildingAdmin($buildingId: UUID!, $userId: UUID!) {
  assignBuildingAdmin(input: {buildingId: $buildingId, userId: $userId})
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AssignBuildingAdminGQL extends Apollo.Mutation<AssignBuildingAdminMutation, AssignBuildingAdminMutationVariables> {
    override document = AssignBuildingAdminDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveBuildingAdminDocument = gql`
    mutation RemoveBuildingAdmin($buildingId: UUID!, $userId: UUID!) {
  removeBuildingAdmin(input: {buildingId: $buildingId, userId: $userId})
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveBuildingAdminGQL extends Apollo.Mutation<RemoveBuildingAdminMutation, RemoveBuildingAdminMutationVariables> {
    override document = RemoveBuildingAdminDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateBuildingEntryDocument = gql`
    mutation CreateBuildingEntry($name: String!, $buildingId: UUID!) {
  createBuildingEntry(input: {name: $name, buildingId: $buildingId}) {
    id
    name
    order
    buildingId
    adminId
    createdAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateBuildingEntryGQL extends Apollo.Mutation<CreateBuildingEntryMutation, CreateBuildingEntryMutationVariables> {
    override document = CreateBuildingEntryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateBuildingEntryDocument = gql`
    mutation UpdateBuildingEntry($id: UUID!, $name: String!) {
  updateBuildingEntry(input: {id: $id, name: $name}) {
    id
    name
    updatedAt: createdAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateBuildingEntryGQL extends Apollo.Mutation<UpdateBuildingEntryMutation, UpdateBuildingEntryMutationVariables> {
    override document = UpdateBuildingEntryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteBuildingEntryDocument = gql`
    mutation DeleteBuildingEntry($id: UUID!) {
  deleteBuildingEntry(id: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteBuildingEntryGQL extends Apollo.Mutation<DeleteBuildingEntryMutation, DeleteBuildingEntryMutationVariables> {
    override document = DeleteBuildingEntryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateTenantDocument = gql`
    mutation CreateTenant($name: String!, $contactPhone: String!, $unitNumber: String!, $buildingEntryId: UUID!, $accessKeyNR: String!, $floor: String, $contactEmail: String) {
  createTenant(
    input: {name: $name, contactPhone: $contactPhone, unitNumber: $unitNumber, buildingEntryId: $buildingEntryId, accessKeyNR: $accessKeyNR, floor: $floor, contactEmail: $contactEmail}
  ) {
    id
    name
    unitNumber
    floor
    contactEmail
    contactPhone
    accessKeyNR
    buildingEntryId
    adminId
    createdAt
    buildingEntry {
      id
      name
    }
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
export const UpdateTenantDocument = gql`
    mutation UpdateTenant($id: UUID!, $name: String, $contactEmail: String, $contactPhone: String, $unitNumber: String, $buildingEntryId: UUID, $floor: String, $accessKeyNR: String) {
  updateTenant(
    input: {id: $id, name: $name, contactEmail: $contactEmail, contactPhone: $contactPhone, unitNumber: $unitNumber, buildingEntryId: $buildingEntryId, floor: $floor, accessKeyNR: $accessKeyNR}
  ) {
    id
    name
    unitNumber
    floor
    contactEmail
    contactPhone
    accessKeyNR
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateTenantGQL extends Apollo.Mutation<UpdateTenantMutation, UpdateTenantMutationVariables> {
    override document = UpdateTenantDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteTenantDocument = gql`
    mutation DeleteTenant($id: UUID!) {
  deleteTenant(id: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteTenantGQL extends Apollo.Mutation<DeleteTenantMutation, DeleteTenantMutationVariables> {
    override document = DeleteTenantDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SetMonthlyStatusDocument = gql`
    mutation SetMonthlyStatus($tenantId: UUID!, $year: Int!, $month: Int!, $status: DecisionStatus!, $note: String, $deviceId: String, $clientTimestamp: DateTime) {
  setMonthlyStatus(
    input: {tenantId: $tenantId, year: $year, month: $month, status: $status, note: $note, deviceId: $deviceId, clientTimestamp: $clientTimestamp}
  ) {
    id
    tenantId
    year
    month
    status
    notes {
      id
      content
      createdBy
      createdByUserId
      createdAt
    }
    decidedByUserId
    decisionDate
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SetMonthlyStatusGQL extends Apollo.Mutation<SetMonthlyStatusMutation, SetMonthlyStatusMutationVariables> {
    override document = SetMonthlyStatusDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ExportAllEntriesToZipDocument = gql`
    mutation ExportAllEntriesToZip($year: Int!) {
  exportAllEntriesToZip(year: $year) {
    base64Zip
    fileName
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ExportAllEntriesToZipGQL extends Apollo.Mutation<ExportAllEntriesToZipMutation, ExportAllEntriesToZipMutationVariables> {
    override document = ExportAllEntriesToZipDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const HealthDocument = gql`
    query Health {
  health
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class HealthGQL extends Apollo.Query<HealthQuery, HealthQueryVariables> {
    override document = HealthDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetMeDocument = gql`
    query GetMe {
  me {
    id
    username
    email
    firstName
    lastName
    role
    isBlocked
    createdAt
    createdByAdminId
    createdManagers {
      id
      username
      firstName
      lastName
      role
      isBlocked
    }
    managedBuildings {
      id
      name
      city
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetMeGQL extends Apollo.Query<GetMeQuery, GetMeQueryVariables> {
    override document = GetMeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUsersDocument = gql`
    query GetUsers($first: Int, $after: String, $where: UserFilterInput, $order: [UserSortInput!]) {
  users(first: $first, after: $after, where: $where, order: $order) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        username
        email
        firstName
        lastName
        role
        isBlocked
        createdAt
        updatedAt
        createdByAdminId
        createdManagers {
          id
          username
          firstName
          lastName
          role
          isBlocked
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetUsersGQL extends Apollo.Query<GetUsersQuery, GetUsersQueryVariables> {
    override document = GetUsersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetBuildingsDocument = gql`
    query GetBuildings($first: Int, $after: String, $where: BuildingFilterInput, $order: [BuildingSortInput!]) {
  buildings(first: $first, after: $after, where: $where, order: $order) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        name
        address
        city
        adminId
        createdAt
        updatedAt
        admin {
          id
          username
          firstName
          lastName
        }
        entries {
          id
          name
          order
          adminId
        }
        administrators {
          id
          username
          firstName
          lastName
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetBuildingsGQL extends Apollo.Query<GetBuildingsQuery, GetBuildingsQueryVariables> {
    override document = GetBuildingsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetBuildingByIdDocument = gql`
    query GetBuildingById($id: UUID!) {
  buildingById(id: $id) {
    id
    name
    address
    city
    adminId
    createdAt
    updatedAt
    admin {
      id
      username
      firstName
      lastName
      email
    }
    entries {
      id
      name
      order
      adminId
      createdAt
      tenants {
        id
        name
        unitNumber
        floor
        contactEmail
        contactPhone
        accessKeyNR
      }
    }
    administrators {
      id
      username
      firstName
      lastName
    }
    tenants {
      id
      name
      unitNumber
      floor
      accessKeyNR
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
export const GetBuildingEntriesDocument = gql`
    query GetBuildingEntries($first: Int, $after: String, $where: BuildingEntryFilterInput, $order: [BuildingEntrySortInput!]) {
  buildingEntries(first: $first, after: $after, where: $where, order: $order) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        name
        order
        buildingId
        adminId
        createdAt
        building {
          id
          name
          city
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetBuildingEntriesGQL extends Apollo.Query<GetBuildingEntriesQuery, GetBuildingEntriesQueryVariables> {
    override document = GetBuildingEntriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetBuildingEntriesByBuildingDocument = gql`
    query GetBuildingEntriesByBuilding($buildingId: UUID!, $first: Int, $after: String) {
  buildingEntriesByBuilding(buildingId: $buildingId, first: $first, after: $after) {
    totalCount
    edges {
      node {
        id
        name
        order
        buildingId
        adminId
        createdAt
        tenants {
          id
          name
          unitNumber
          floor
          contactPhone
          accessKeyNR
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetBuildingEntriesByBuildingGQL extends Apollo.Query<GetBuildingEntriesByBuildingQuery, GetBuildingEntriesByBuildingQueryVariables> {
    override document = GetBuildingEntriesByBuildingDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetBuildingEntryByIdDocument = gql`
    query GetBuildingEntryById($id: UUID!) {
  buildingEntryById(id: $id) {
    id
    name
    order
    buildingId
    adminId
    createdAt
    building {
      id
      name
      city
      admin {
        id
        firstName
        lastName
      }
    }
    tenants {
      id
      name
      unitNumber
      floor
      contactEmail
      contactPhone
      accessKeyNR
      monthlyDecisions {
        id
        year
        month
        status
        updatedAt
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetBuildingEntryByIdGQL extends Apollo.Query<GetBuildingEntryByIdQuery, GetBuildingEntryByIdQueryVariables> {
    override document = GetBuildingEntryByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetTenantsDocument = gql`
    query GetTenants($first: Int, $after: String, $where: TenantFilterInput, $order: [TenantSortInput!]) {
  tenants(first: $first, after: $after, where: $where, order: $order) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        name
        unitNumber
        floor
        contactEmail
        contactPhone
        accessKeyNR
        buildingEntryId
        adminId
        createdAt
        updatedAt
        buildingEntry {
          id
          name
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetTenantsGQL extends Apollo.Query<GetTenantsQuery, GetTenantsQueryVariables> {
    override document = GetTenantsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetTenantByIdDocument = gql`
    query GetTenantById($id: UUID!) {
  tenantById(id: $id) {
    id
    name
    unitNumber
    floor
    contactEmail
    contactPhone
    accessKeyNR
    buildingEntryId
    adminId
    createdAt
    updatedAt
    buildingEntry {
      id
      name
      order
    }
    monthlyDecisions {
      id
      year
      month
      status
      decisionDate
      updatedAt
      decidedByUserId
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetTenantByIdGQL extends Apollo.Query<GetTenantByIdQuery, GetTenantByIdQueryVariables> {
    override document = GetTenantByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetTenantHistoryDocument = gql`
    query GetTenantHistory($tenantId: UUID!, $first: Int, $after: String) {
  tenantHistory(tenantId: $tenantId, first: $first, after: $after) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        year
        month
        status
        decisionDate
        decidedByUserId
        updatedAt
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetTenantHistoryGQL extends Apollo.Query<GetTenantHistoryQuery, GetTenantHistoryQueryVariables> {
    override document = GetTenantHistoryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetTenantsWithDecisionsDocument = gql`
    query GetTenantsWithDecisions($first: Int, $after: String, $where: TenantFilterInput, $order: [TenantSortInput!], $buildingId: UUID) {
  tenants(
    first: $first
    after: $after
    where: $where
    order: $order
    buildingId: $buildingId
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        name
        unitNumber
        floor
        accessKeyNR
        contactPhone
        buildingEntryId
        buildingEntry {
          id
          name
          building {
            id
            name
            city
          }
        }
        monthlyDecisions {
          id
          year
          month
          status
          notes {
            id
            content
            createdBy
            createdByUserId
            createdAt
          }
          updatedAt
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetTenantsWithDecisionsGQL extends Apollo.Query<GetTenantsWithDecisionsQuery, GetTenantsWithDecisionsQueryVariables> {
    override document = GetTenantsWithDecisionsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetTenantDecisionsDocument = gql`
    query GetTenantDecisions($tenantId: UUID!, $year: Int) {
  tenantDecisions(tenantId: $tenantId, year: $year) {
    id
    tenantId
    year
    month
    status
    decisionDate
    decidedByUserId
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetTenantDecisionsGQL extends Apollo.Query<GetTenantDecisionsQuery, GetTenantDecisionsQueryVariables> {
    override document = GetTenantDecisionsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }