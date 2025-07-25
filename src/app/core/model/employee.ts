
export interface BaseEmployee {
    empName: string;
    empEmail: string;
    empAddress: string;
    empPhone: string;
  }
  export interface Employee extends BaseEmployee {
    empId: number;

  }