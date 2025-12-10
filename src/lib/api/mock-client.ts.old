/**
 * Mock API Client
 * ใช้สำหรับเชื่อมต่อกับ json-server ในระหว่างการพัฒนา
 */

const MOCK_API_URL = process.env.MOCK_API_URL || 'http://localhost:3001';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

/**
 * ส่ง HTTP request ไปยัง mock API
 */
async function mockFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const url = `${MOCK_API_URL}${endpoint}`;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`Mock API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Mock API request failed:', error);
    throw error;
  }
}

/**
 * Mock Client สำหรับจัดการ employees
 */
export const mockEmployeeClient = {
  /**
   * ดึงข้อมูลพนักงานทั้งหมด
   */
  async getAll(params?: { group?: string; employeeType?: string; search?: string }) {
    let endpoint = '/api/employees';
    const queryParams = new URLSearchParams();

    if (params?.group) queryParams.append('group_like', params.group);
    if (params?.employeeType) queryParams.append('employeeType', params.employeeType);
    if (params?.search) queryParams.append('q', params.search);

    const query = queryParams.toString();
    if (query) endpoint += `?${query}`;

    return mockFetch<any[]>(endpoint);
  },

  /**
   * ดึงข้อมูลพนักงานตาม empCode
   */
  async getByEmpCode(empCode: string) {
    // json-server ไม่รองรับ custom query ต้อง GET all แล้ว filter
    const employees = await mockFetch<any[]>('/api/employees');
    return employees.find(emp => emp.empCode === empCode) || null;
  },

  /**
   * สร้างพนักงานใหม่
   */
  async create(employee: any) {
    return mockFetch('/api/employees', {
      method: 'POST',
      body: employee,
    });
  },

  /**
   * อัปเดตข้อมูลพนักงาน
   */
  async update(id: number, employee: any) {
    return mockFetch(`/api/employees/${id}`, {
      method: 'PUT',
      body: employee,
    });
  },

  /**
   * ลบพนักงาน
   */
  async delete(id: number) {
    return mockFetch(`/api/employees/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Mock Client สำหรับจัดการ assessments
 */
export const mockAssessmentClient = {
  /**
   * ดึงข้อมูล assessments ทั้งหมด
   */
  async getAll(params?: { empCode?: string; year?: number; status?: string }) {
    let endpoint = '/api/assessments';
    const queryParams = new URLSearchParams();

    if (params?.empCode) queryParams.append('empCode', params.empCode);
    if (params?.year) queryParams.append('year', params.year.toString());
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    if (query) endpoint += `?${query}`;

    return mockFetch<any[]>(endpoint);
  },

  /**
   * ดึงข้อมูล assessment ตาม ID
   */
  async getById(id: string) {
    // Try direct ID access first
    try {
      return await mockFetch<any>(`/api/assessments/${id}`);
    } catch (error) {
      // Fallback to search by id field
      const assessments = await mockFetch<any[]>(`/api/assessments?id=${id}`);
      return assessments[0] || null;
    }
  },

  /**
   * สร้าง assessment ใหม่
   */
  async create(assessment: any) {
    return mockFetch('/api/assessments', {
      method: 'POST',
      body: assessment,
    });
  },

  /**
   * อัปเดต assessment
   */
  async update(id: string, assessment: any) {
    return mockFetch(`/api/assessments/${id}`, {
      method: 'PATCH',
      body: assessment,
    });
  },

  /**
   * ลบ assessment
   */
  async delete(id: string) {
    return mockFetch(`/api/assessments/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Mock Client สำหรับจัดการ questions
 */
export const mockQuestionClient = {
  /**
   * ดึงข้อมูล questions ทั้งหมด
   */
  async getAll(params?: { level?: string; category?: string }) {
    let endpoint = '/api/questions';
    const queryParams = new URLSearchParams();

    if (params?.level) queryParams.append('level', params.level);
    if (params?.category) queryParams.append('category', params.category);

    const query = queryParams.toString();
    if (query) endpoint += `?${query}`;

    return mockFetch<any[]>(endpoint);
  },

  /**
   * ดึงข้อมูล question ตาม ID
   */
  async getById(id: number) {
    return mockFetch<any>(`/api/questions/${id}`);
  },

  /**
   * สร้าง question ใหม่
   */
  async create(question: any) {
    return mockFetch('/api/questions', {
      method: 'POST',
      body: question,
    });
  },

  /**
   * อัปเดต question
   */
  async update(id: number, question: any) {
    return mockFetch(`/api/questions/${id}`, {
      method: 'PUT',
      body: question,
    });
  },

  /**
   * ลบ question
   */
  async delete(id: number) {
    return mockFetch(`/api/questions/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Mock Client สำหรับจัดการ responses
 */
export const mockResponseClient = {
  /**
   * ดึงข้อมูล responses ทั้งหมด
   */
  async getAll(params?: { assessmentId?: string }) {
    let endpoint = '/responses';
    if (params?.assessmentId) {
      endpoint += `?assessmentId=${params.assessmentId}`;
    }
    return mockFetch<any[]>(endpoint);
  },

  /**
   * ดึงข้อมูล response ตาม ID
   */
  async getById(id: number) {
    return mockFetch<any>(`/responses/${id}`);
  },

  /**
   * สร้าง response ใหม่
   */
  async create(response: any) {
    return mockFetch('/responses', {
      method: 'POST',
      body: response,
    });
  },

  /**
   * อัปเดต response
   */
  async update(id: number, response: any) {
    return mockFetch(`/responses/${id}`, {
      method: 'PATCH',
      body: response,
    });
  },

  /**
   * ลบ response
   */
  async delete(id: number) {
    return mockFetch(`/responses/${id}`, {
      method: 'DELETE',
    });
  },
};
