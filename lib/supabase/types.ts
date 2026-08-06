export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AccountType =
  | "checking"
  | "savings"
  | "credit_card"
  | "cash"
  | "investment"
  | "other";

export type CategoryType = "needs" | "wants" | "invested" | "income" | "custom";

export type TransactionType = "income" | "expense" | "transfer";

export type TransactionBucket = "needs" | "wants" | "invested" | "income" | "other";

export type TransactionStatus = "completed" | "pending";

export type LoanType = "given" | "received" | "repaid";

export type LoanStatus = "pending" | "repaid" | "closed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: AccountType;
          balance: number;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type?: AccountType;
          balance?: number;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: AccountType;
          balance?: number;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          type: CategoryType;
          color: string | null;
          icon: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          type?: CategoryType;
          color?: string | null;
          icon?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          type?: CategoryType;
          color?: string | null;
          icon?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string | null;
          category_id: string | null;
          amount: number;
          type: TransactionType;
          bucket: TransactionBucket;
          date: string;
          note: string | null;
          status: TransactionStatus;
          is_loan: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id?: string | null;
          category_id?: string | null;
          amount: number;
          type: TransactionType;
          bucket?: TransactionBucket;
          date?: string;
          note?: string | null;
          status?: TransactionStatus;
          is_loan?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string | null;
          category_id?: string | null;
          amount?: number;
          type?: TransactionType;
          bucket?: TransactionBucket;
          date?: string;
          note?: string | null;
          status?: TransactionStatus;
          is_loan?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          month: string;
          target_amount: number;
          needs_ratio: number;
          wants_ratio: number;
          invested_ratio: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          month: string;
          target_amount?: number;
          needs_ratio?: number;
          wants_ratio?: number;
          invested_ratio?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          month?: string;
          target_amount?: number;
          needs_ratio?: number;
          wants_ratio?: number;
          invested_ratio?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      loan_entries: {
        Row: {
          id: string;
          user_id: string;
          person_name: string;
          amount: number;
          type: LoanType;
          status: LoanStatus;
          due_date: string | null;
          note: string | null;
          transaction_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          person_name: string;
          amount: number;
          type: LoanType;
          status?: LoanStatus;
          due_date?: string | null;
          note?: string | null;
          transaction_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          person_name?: string;
          amount?: number;
          type?: LoanType;
          status?: LoanStatus;
          due_date?: string | null;
          note?: string | null;
          transaction_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      monthly_summaries: {
        Row: {
          id: string;
          user_id: string;
          month: string;
          total_income: number;
          total_expense: number;
          total_needs: number;
          total_wants: number;
          total_invested: number;
          budget_remaining: number;
          ai_insight: string | null;
          model_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          month: string;
          total_income?: number;
          total_expense?: number;
          total_needs?: number;
          total_wants?: number;
          total_invested?: number;
          budget_remaining?: number;
          ai_insight?: string | null;
          model_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          month?: string;
          total_income?: number;
          total_expense?: number;
          total_needs?: number;
          total_wants?: number;
          total_invested?: number;
          budget_remaining?: number;
          ai_insight?: string | null;
          model_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type AccountRow = Database["public"]["Tables"]["accounts"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type TransactionRow = Database["public"]["Tables"]["transactions"]["Row"];
export type BudgetRow = Database["public"]["Tables"]["budgets"]["Row"];
export type LoanEntryRow = Database["public"]["Tables"]["loan_entries"]["Row"];
export type MonthlySummaryRow = Database["public"]["Tables"]["monthly_summaries"]["Row"];
export type LogRow = Database["public"]["Tables"]["logs"]["Row"];

export interface TransactionWithDetails extends TransactionRow {
  account?: AccountRow | null;
  category?: CategoryRow | null;
}

export interface DashboardSummary {
  month: string;
  totalIncome: number;
  totalExpense: number;
  totalNeeds: number;
  totalWants: number;
  totalInvested: number;
  budgetTarget: number;
  budgetRemaining: number;
  needsRatio: number;
  wantsRatio: number;
  investedRatio: number;
  wantsOverspent: boolean;
  recentTransactions: TransactionWithDetails[];
  activeLoansCount: number;
  activeLoansAmount: number;
  givenLoansAmount?: number;
  takenLoansAmount?: number;
  recentLoans?: LoanEntryRow[];
}
