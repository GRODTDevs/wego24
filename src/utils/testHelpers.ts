
/**
 * Test Utilities and Helpers
 * 
 * Provides common testing utilities for:
 * - Mock data generation
 * - Test setup and teardown
 * - Common assertions
 * - Integration test helpers
 */

// Mock driver data for testing
export const mockDriverData = {
  id: 'driver-123',
  user_id: 'user-123',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  vehicle_type: 'car',
  vehicle_info: {
    make: 'Toyota',
    model: 'Camry',
    year: '2020',
    licensePlate: 'ABC123'
  },
  is_active: true,
  is_available: false,
  rating: 4.8,
  total_deliveries: 150,
  registration_status: 'approved',
  background_check_status: 'approved',
  created_at: '2023-01-01T00:00:00Z'
};

// Mock performance data
export const mockPerformanceData = [
  {
    id: 'perf-1',
    driver_id: 'driver-123',
    metric_date: '2024-01-01',
    total_deliveries: 12,
    successful_deliveries: 11,
    cancelled_deliveries: 1,
    total_earnings: 95.50,
    customer_rating_average: 4.8,
    on_time_percentage: 92
  },
  {
    id: 'perf-2',
    driver_id: 'driver-123',
    metric_date: '2024-01-02',
    total_deliveries: 8,
    successful_deliveries: 8,
    cancelled_deliveries: 0,
    total_earnings: 68.25,
    customer_rating_average: 4.9,
    on_time_percentage: 100
  }
];

// Mock document data
export const mockDocuments = [
  {
    id: 'doc-1',
    driver_id: 'driver-123',
    document_type: 'driverLicense',
    document_name: 'drivers_license.pdf',
    document_url: 'https://example.com/doc1.pdf',
    status: 'approved',
    uploaded_at: '2023-12-01T00:00:00Z',
    verified_at: '2023-12-02T00:00:00Z'
  },
  {
    id: 'doc-2',
    driver_id: 'driver-123',
    document_type: 'vehicleRegistration',
    document_name: 'vehicle_reg.pdf',
    document_url: 'https://example.com/doc2.pdf',
    status: 'pending',
    uploaded_at: '2023-12-01T00:00:00Z'
  }
];

/**
 * Utility function to generate mock earnings data
 */
export const generateMockEarnings = (days: number) => {
  const earnings = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    earnings.push({
      id: `earning-${i}`,
      driver_id: 'driver-123',
      metric_date: date.toISOString().split('T')[0],
      total_deliveries: Math.floor(Math.random() * 15) + 5,
      total_earnings: Math.floor(Math.random() * 100) + 50,
      successful_deliveries: Math.floor(Math.random() * 12) + 5,
      cancelled_deliveries: Math.floor(Math.random() * 2)
    });
  }
  
  return earnings.reverse();
};

/**
 * Business logic testing utilities
 */
export const BusinessLogicTests = {
  /**
   * Test courier price calculation
   */
  testPriceCalculation: (distance: number, baseFee: number = 8.50, perKmRate: number = 0.75) => {
    const distanceFee = distance * perKmRate;
    const totalPrice = baseFee + distanceFee;
    
    return {
      distance,
      baseFee,
      distanceFee,
      totalPrice,
      isValid: totalPrice > 0 && distance >= 0
    };
  },

  /**
   * Test driver performance calculations
   */
  testPerformanceMetrics: (deliveries: number, successful: number, cancelled: number) => {
    const successRate = deliveries > 0 ? (successful / deliveries) * 100 : 0;
    const cancellationRate = deliveries > 0 ? (cancelled / deliveries) * 100 : 0;
    
    return {
      successRate,
      cancellationRate,
      isPerformanceGood: successRate >= 90 && cancellationRate <= 5
    };
  },

  /**
   * Test earnings calculations
   */
  testEarningsCalculation: (deliveries: number, baseRate: number = 6.50, tips: number = 0) => {
    const baseEarnings = deliveries * baseRate;
    const totalEarnings = baseEarnings + tips;
    const avgPerDelivery = deliveries > 0 ? totalEarnings / deliveries : 0;
    
    return {
      baseEarnings,
      tips,
      totalEarnings,
      avgPerDelivery,
      isValid: totalEarnings >= 0
    };
  }
};

/**
 * Integration test helpers
 */
export const IntegrationTestHelpers = {
  /**
   * Setup test driver profile
   */
  setupTestDriver: async (supabase: any, userData: any) => {
    const { data, error } = await supabase
      .from('drivers')
      .insert(userData)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Cleanup test data
   */
  cleanupTestData: async (supabase: any, driverId: string) => {
    // Clean up in correct order due to foreign key constraints
    await supabase.from('driver_documents').delete().eq('driver_id', driverId);
    await supabase.from('driver_performance').delete().eq('driver_id', driverId);
    await supabase.from('driver_locations').delete().eq('driver_id', driverId);
    await supabase.from('drivers').delete().eq('id', driverId);
  },

  /**
   * Simulate real-time updates
   */
  simulateRealtimeUpdate: (channel: any, table: string, eventType: string, payload: any) => {
    // This would be used in integration tests to simulate real-time events
    channel.trigger('postgres_changes', {
      event: eventType,
      schema: 'public',
      table,
      new: payload,
      old: eventType === 'UPDATE' ? payload : null
    });
  }
};

/**
 * Common test assertions
 */
export const TestAssertions = {
  assertDriverProfileValid: (driver: any) => {
    const requiredFields = ['id', 'user_id', 'vehicle_type', 'registration_status'];
    const missingFields = requiredFields.filter(field => !driver[field]);
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
      hasValidEmail: driver.email && driver.email.includes('@'),
      hasValidRating: driver.rating >= 0 && driver.rating <= 5
    };
  },

  assertDocumentValid: (document: any) => {
    const requiredFields = ['id', 'driver_id', 'document_type', 'document_url', 'status'];
    const missingFields = requiredFields.filter(field => !document[field]);
    const validStatuses = ['pending', 'approved', 'rejected'];
    
    return {
      isValid: missingFields.length === 0 && validStatuses.includes(document.status),
      missingFields,
      hasValidStatus: validStatuses.includes(document.status),
      hasValidUrl: document.document_url && document.document_url.startsWith('http')
    };
  }
};
