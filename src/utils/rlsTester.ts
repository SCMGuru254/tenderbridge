import { supabase } from '@/integrations/supabase/client';

export interface RLSTestResult {
  table: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  success: boolean;
  error?: string;
  rowCount?: number;
}

/**
 * Test RLS policies for authenticated users
 * This utility helps verify that Row Level Security is working correctly
 */
export class RLSTester {
  
  /**
   * Test SELECT operation on a table
   */
  static async testSelect(tableName: string): Promise<RLSTestResult> {
    try {
      const { error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(1);

      return {
        table: tableName,
        operation: 'SELECT',
        success: !error,
        error: error?.message,
        rowCount: count || 0
      };
    } catch (error: any) {
      return {
        table: tableName,
        operation: 'SELECT',
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Test INSERT operation on a table
   */
  static async testInsert(tableName: string, data: Record<string, any>): Promise<RLSTestResult> {
    try {
      const { error } = await supabase
        .from(tableName)
        .insert(data)
        .select();

      return {
        table: tableName,
        operation: 'INSERT',
        success: !error,
        error: error?.message
      };
    } catch (error: any) {
      return {
        table: tableName,
        operation: 'INSERT',
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Test UPDATE operation on a table
   */
  static async testUpdate(
    tableName: string, 
    filter: Record<string, any>, 
    updates: Record<string, any>
  ): Promise<RLSTestResult> {
    try {
      let query = supabase.from(tableName).update(updates);
      
      // Apply filters
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { error } = await query.select();

      return {
        table: tableName,
        operation: 'UPDATE',
        success: !error,
        error: error?.message
      };
    } catch (error: any) {
      return {
        table: tableName,
        operation: 'UPDATE',
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Test DELETE operation on a table
   */
  static async testDelete(tableName: string, filter: Record<string, any>): Promise<RLSTestResult> {
    try {
      let query = supabase.from(tableName).delete();
      
      // Apply filters
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { error } = await query;

      return {
        table: tableName,
        operation: 'DELETE',
        success: !error,
        error: error?.message
      };
    } catch (error: any) {
      return {
        table: tableName,
        operation: 'DELETE',
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Run comprehensive RLS tests for common tables
   */
  static async runComprehensiveTests(): Promise<RLSTestResult[]> {
    const results: RLSTestResult[] = [];

    // Test common tables
    const tablesToTest = [
      'profiles',
      'jobs',
      'companies',
      'company_reviews',
      'discussions',
      'courses',
      'hr_profiles',
      'mentors',
      'mentees'
    ];

    for (const table of tablesToTest) {
      // Test SELECT
      results.push(await this.testSelect(table));
    }

    return results;
  }

  /**
   * Format test results for display
   */
  static formatResults(results: RLSTestResult[]): string {
    let output = '\n=== RLS Test Results ===\n\n';

    results.forEach(result => {
      const status = result.success ? '✓ PASS' : '✗ FAIL';
      output += `${status} | ${result.table} | ${result.operation}\n`;
      
      if (result.error) {
        output += `  Error: ${result.error}\n`;
      }
      
      if (result.rowCount !== undefined) {
        output += `  Rows: ${result.rowCount}\n`;
      }
      
      output += '\n';
    });

    return output;
  }
}
