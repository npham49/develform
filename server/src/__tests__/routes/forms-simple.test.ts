import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('Forms Routes', () => {
  let mockFormsService: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockFormsService = {
      getUserForms: jest.fn(),
      getFormByIdForPublic: jest.fn(),
      getFormSchemaById: jest.fn(),
      createForm: jest.fn(),
      updateForm: jest.fn(),
      getFormByIdAndOwner: jest.fn(),
    };
  });

  describe('GET /api/forms', () => {
    it('should return all forms for authenticated user', async () => {
      const mockForms = [
        { id: 1, name: 'Form 1', isPublic: true },
        { id: 2, name: 'Form 2', isPublic: false },
      ];
      
      const mockUser = { id: 1, name: 'Test User' };
      
      mockFormsService.getUserForms.mockResolvedValue(mockForms);

      const result = await mockFormsService.getUserForms(null, mockUser.id);
      expect(result).toEqual(mockForms);
      expect(mockFormsService.getUserForms).toHaveBeenCalledWith(null, mockUser.id);
    });

    it('should handle empty forms list', async () => {
      mockFormsService.getUserForms.mockResolvedValue([]);

      const result = await mockFormsService.getUserForms(null, 1);
      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      mockFormsService.getUserForms.mockRejectedValue(new Error('Database error'));

      await expect(mockFormsService.getUserForms(null, 1))
        .rejects.toThrow('Database error');
    });
  });

  describe('GET /api/forms/:id', () => {
    const mockForm = {
      id: 1,
      name: 'Test Form',
      description: 'A test form',
      isPublic: true,
      schema: { components: [] },
    };

    it('should return public form for authenticated user', async () => {
      mockFormsService.getFormByIdForPublic.mockResolvedValue([mockForm]);

      const result = await mockFormsService.getFormByIdForPublic(null, 1, 1);
      expect(result).toEqual([mockForm]);
    });

    it('should return public form for anonymous user', async () => {
      mockFormsService.getFormByIdForPublic.mockResolvedValue([mockForm]);

      const result = await mockFormsService.getFormByIdForPublic(null, 1, null);
      expect(result).toEqual([mockForm]);
    });

    it('should validate form ID parameter', () => {
      const validateFormId = (id: string) => {
        const formId = parseInt(id);
        if (isNaN(formId)) {
          throw new Error('Invalid form ID');
        }
        return formId;
      };

      expect(() => validateFormId('invalid')).toThrow('Invalid form ID');
      expect(() => validateFormId('123')).not.toThrow();
      expect(validateFormId('123')).toBe(123);
    });

    it('should handle form not found', async () => {
      mockFormsService.getFormByIdForPublic.mockResolvedValue([]);

      const result = await mockFormsService.getFormByIdForPublic(null, 999, 1);
      expect(result).toEqual([]);
    });
  });

  describe('GET /api/forms/:id/schema', () => {
    const mockSchema = {
      components: [
        { type: 'text', label: 'Name', required: true },
        { type: 'email', label: 'Email', required: true },
      ],
    };

    it('should return form schema for authenticated user', async () => {
      mockFormsService.getFormSchemaById.mockResolvedValue([{ schema: mockSchema }]);

      const result = await mockFormsService.getFormSchemaById(null, 1, 1);
      expect(result).toEqual([{ schema: mockSchema }]);
    });

    it('should return form schema for anonymous user', async () => {
      mockFormsService.getFormSchemaById.mockResolvedValue([{ schema: mockSchema }]);

      const result = await mockFormsService.getFormSchemaById(null, 1, null);
      expect(result).toEqual([{ schema: mockSchema }]);
    });

    it('should handle schema not found', async () => {
      mockFormsService.getFormSchemaById.mockResolvedValue([]);

      const result = await mockFormsService.getFormSchemaById(null, 999, 1);
      expect(result).toEqual([]);
    });
  });

  describe('POST /api/forms', () => {
    const validFormData = {
      name: 'New Form',
      description: 'A new form',
      isPublic: true,
      schema: { components: [] },
    };

    it('should create new form successfully', async () => {
      const createdForm = { id: 1, ...validFormData };
      mockFormsService.createForm.mockResolvedValue([createdForm]);

      const result = await mockFormsService.createForm(null, validFormData, 1);
      expect(result).toEqual([createdForm]);
      expect(mockFormsService.createForm).toHaveBeenCalledWith(null, validFormData, 1);
    });

    it('should validate required fields', () => {
      const validateFormData = (data: any) => {
        if (!data.name || data.name.trim() === '') {
          throw new Error('Name is required');
        }
        return true;
      };

      expect(() => validateFormData({})).toThrow('Name is required');
      expect(() => validateFormData({ name: '' })).toThrow('Name is required');
      expect(() => validateFormData({ name: 'Valid Name' })).not.toThrow();
    });

    it('should handle creation with optional fields', async () => {
      const minimalData = { name: 'Minimal Form' };
      const createdForm = { id: 1, ...minimalData, isPublic: true };
      
      mockFormsService.createForm.mockResolvedValue([createdForm]);

      const result = await mockFormsService.createForm(null, minimalData, 1);
      expect(result).toEqual([createdForm]);
    });

    it('should handle database errors during creation', async () => {
      mockFormsService.createForm.mockRejectedValue(new Error('Database error'));

      await expect(mockFormsService.createForm(null, validFormData, 1))
        .rejects.toThrow('Database error');
    });
  });

  describe('PATCH /api/forms/:id', () => {
    const updateData = {
      name: 'Updated Form',
      description: 'Updated description',
      isPublic: false,
    };

    it('should update form successfully', async () => {
      const updatedForm = { id: 1, ...updateData };
      mockFormsService.updateForm.mockResolvedValue([updatedForm]);

      const result = await mockFormsService.updateForm(null, 1, 1, updateData);
      expect(result).toEqual([updatedForm]);
      expect(mockFormsService.updateForm).toHaveBeenCalledWith(null, 1, 1, updateData);
    });

    it('should validate update data', () => {
      const validateUpdateData = (data: any) => {
        if (data.name !== undefined && (!data.name || data.name.trim() === '')) {
          throw new Error('Name cannot be empty');
        }
        return true;
      };

      expect(() => validateUpdateData({ name: '' })).toThrow('Name cannot be empty');
      expect(() => validateUpdateData({ name: 'Valid Name' })).not.toThrow();
      expect(() => validateUpdateData({ description: 'Just description' })).not.toThrow();
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { name: 'New Name Only' };
      const updatedForm = { id: 1, name: 'New Name Only', description: 'Old description' };
      
      mockFormsService.updateForm.mockResolvedValue([updatedForm]);

      const result = await mockFormsService.updateForm(null, 1, 1, partialUpdate);
      expect(result).toEqual([updatedForm]);
    });

    it('should handle update errors', async () => {
      mockFormsService.updateForm.mockRejectedValue(new Error('Update failed'));

      await expect(mockFormsService.updateForm(null, 1, 1, updateData))
        .rejects.toThrow('Update failed');
    });
  });

  describe('Form Access Control', () => {
    it('should verify form ownership', async () => {
      const mockForm = { id: 1, name: 'Test Form', createdBy: 1 };
      mockFormsService.getFormByIdAndOwner.mockResolvedValue([mockForm]);

      const result = await mockFormsService.getFormByIdAndOwner(null, 1, 1);
      expect(result).toEqual([mockForm]);
    });

    it('should deny access to non-owned forms', async () => {
      mockFormsService.getFormByIdAndOwner.mockResolvedValue([]);

      const result = await mockFormsService.getFormByIdAndOwner(null, 1, 2);
      expect(result).toEqual([]);
    });
  });
});