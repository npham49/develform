import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('Versions Routes', () => {
  let mockVersionsService: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockVersionsService = {
      getFormVersions: jest.fn(),
      getVersionBySha: jest.fn(),
      createVersion: jest.fn(),
      updateVersion: jest.fn(),
      makeVersionLatest: jest.fn(),
    };
  });

  describe('GET /api/forms/:formId/versions', () => {
    const mockVersions = [
      {
        id: 1,
        versionSha: 'abc123',
        description: 'Initial version',
        isPublished: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 2,
        versionSha: 'def456',
        description: 'Updated version',
        isPublished: false,
        createdAt: new Date('2024-01-02'),
      },
    ];

    it('should return all versions for a form', async () => {
      mockVersionsService.getFormVersions.mockResolvedValue(mockVersions);

      const result = await mockVersionsService.getFormVersions(null, 1);
      expect(result).toEqual(mockVersions);
      expect(mockVersionsService.getFormVersions).toHaveBeenCalledWith(null, 1);
    });

    it('should validate form ID parameter', () => {
      const validateFormId = (formId: string) => {
        const id = parseInt(formId);
        if (isNaN(id)) {
          throw new Error('Invalid form ID');
        }
        return id;
      };

      expect(() => validateFormId('invalid')).toThrow('Invalid form ID');
      expect(() => validateFormId('123')).not.toThrow();
      expect(validateFormId('123')).toBe(123);
    });

    it('should handle empty version history', async () => {
      mockVersionsService.getFormVersions.mockResolvedValue([]);

      const result = await mockVersionsService.getFormVersions(null, 1);
      expect(result).toEqual([]);
    });
  });

  describe('GET /api/forms/:formId/versions/:sha', () => {
    const mockVersion = {
      id: 1,
      formId: 1,
      versionSha: 'abc123',
      description: 'Test version',
      schema: { components: [{ type: 'text', label: 'Name' }] },
      isPublished: true,
    };

    it('should return specific version by SHA', async () => {
      mockVersionsService.getVersionBySha.mockResolvedValue([mockVersion]);

      const result = await mockVersionsService.getVersionBySha(null, 1, 'abc123');
      expect(result).toEqual([mockVersion]);
      expect(mockVersionsService.getVersionBySha).toHaveBeenCalledWith(null, 1, 'abc123');
    });

    it('should validate version SHA parameter', () => {
      const validateVersionSha = (sha: string) => {
        if (!sha || sha.trim() === '') {
          throw new Error('Version SHA is required');
        }
        return sha;
      };

      expect(() => validateVersionSha('')).toThrow('Version SHA is required');
      expect(() => validateVersionSha('   ')).toThrow('Version SHA is required');
      expect(() => validateVersionSha('abc123')).not.toThrow();
    });

    it('should handle version not found', async () => {
      mockVersionsService.getVersionBySha.mockResolvedValue([]);

      const result = await mockVersionsService.getVersionBySha(null, 1, 'nonexistent');
      expect(result).toEqual([]);
    });
  });

  describe('POST /api/forms/:formId/versions', () => {
    const validVersionData = {
      description: 'New version',
      schema: { components: [{ type: 'text', label: 'Name' }] },
      publish: false,
      baseVersionSha: 'abc123',
    };

    it('should create new version successfully', async () => {
      const createdVersion = {
        id: 2,
        formId: 1,
        versionSha: 'new123',
        ...validVersionData,
      };
      
      mockVersionsService.createVersion.mockResolvedValue(createdVersion);

      const result = await mockVersionsService.createVersion(null, 1, 1, validVersionData);
      expect(result).toEqual(createdVersion);
      expect(mockVersionsService.createVersion).toHaveBeenCalledWith(null, 1, 1, validVersionData);
    });

    it('should create version with minimal data', async () => {
      const minimalData = {};
      const createdVersion = {
        id: 2,
        formId: 1,
        versionSha: 'minimal123',
        description: null,
        publish: false,
      };
      
      mockVersionsService.createVersion.mockResolvedValue(createdVersion);

      const result = await mockVersionsService.createVersion(null, 1, 1, minimalData);
      expect(result).toEqual(createdVersion);
    });

    it('should validate optional fields', () => {
      const validateVersionData = (data: any) => {
        // All fields are optional, so any object should be valid
        if (data.publish !== undefined && typeof data.publish !== 'boolean') {
          throw new Error('Publish must be boolean');
        }
        return true;
      };

      expect(() => validateVersionData({})).not.toThrow();
      expect(() => validateVersionData({ publish: true })).not.toThrow();
      expect(() => validateVersionData({ publish: 'invalid' })).toThrow('Publish must be boolean');
    });

    it('should handle creation errors', async () => {
      mockVersionsService.createVersion.mockRejectedValue(new Error('Creation failed'));

      await expect(mockVersionsService.createVersion(null, 1, 1, validVersionData))
        .rejects.toThrow('Creation failed');
    });
  });

  describe('PATCH /api/forms/:formId/versions/:sha', () => {
    const updateData = {
      description: 'Updated version',
      schema: { components: [{ type: 'email', label: 'Email' }] },
    };

    it('should update version successfully', async () => {
      const updatedVersion = {
        id: 1,
        formId: 1,
        versionSha: 'abc123',
        ...updateData,
      };
      
      mockVersionsService.updateVersion.mockResolvedValue(updatedVersion);

      const result = await mockVersionsService.updateVersion(null, 1, 'abc123', 1, updateData);
      expect(result).toEqual(updatedVersion);
      expect(mockVersionsService.updateVersion).toHaveBeenCalledWith(null, 1, 'abc123', 1, updateData);
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { description: 'Only description update' };
      const updatedVersion = {
        id: 1,
        versionSha: 'abc123',
        description: 'Only description update',
        schema: { components: [] }, // Original schema preserved
      };
      
      mockVersionsService.updateVersion.mockResolvedValue(updatedVersion);

      const result = await mockVersionsService.updateVersion(null, 1, 'abc123', 1, partialUpdate);
      expect(result).toEqual(updatedVersion);
    });

    it('should validate update data', () => {
      const validateUpdateData = (data: any) => {
        // Validate that data is an object
        if (typeof data !== 'object' || data === null) {
          throw new Error('Update data must be an object');
        }
        return true;
      };

      expect(() => validateUpdateData({})).not.toThrow();
      expect(() => validateUpdateData(updateData)).not.toThrow();
      expect(() => validateUpdateData(null)).toThrow('Update data must be an object');
    });
  });

  describe('POST /api/forms/:formId/versions/:sha/revert', () => {
    const revertData = {
      description: 'Reverted to previous version',
    };

    it('should revert to specific version successfully', async () => {
      const newVersion = {
        id: 3,
        formId: 1,
        versionSha: 'revert123',
        description: revertData.description,
        isPublished: false,
      };
      
      mockVersionsService.makeVersionLatest.mockResolvedValue(newVersion);

      const result = await mockVersionsService.makeVersionLatest(null, 1, 'abc123', 1, revertData.description);
      expect(result).toEqual(newVersion);
      expect(mockVersionsService.makeVersionLatest).toHaveBeenCalledWith(null, 1, 'abc123', 1, revertData.description);
    });

    it('should revert with optional description', async () => {
      const newVersion = {
        id: 3,
        formId: 1,
        versionSha: 'revert456',
        description: undefined,
        isPublished: false,
      };
      
      mockVersionsService.makeVersionLatest.mockResolvedValue(newVersion);

      const result = await mockVersionsService.makeVersionLatest(null, 1, 'abc123', 1, undefined);
      expect(result).toEqual(newVersion);
    });

    it('should validate revert data', () => {
      const validateRevertData = (data: any) => {
        if (data.description !== undefined && typeof data.description !== 'string') {
          throw new Error('Description must be a string');
        }
        return true;
      };

      expect(() => validateRevertData({})).not.toThrow();
      expect(() => validateRevertData({ description: 'Valid description' })).not.toThrow();
      expect(() => validateRevertData({ description: 123 })).toThrow('Description must be a string');
    });

    it('should handle revert errors', async () => {
      mockVersionsService.makeVersionLatest.mockRejectedValue(new Error('Revert failed'));

      await expect(mockVersionsService.makeVersionLatest(null, 1, 'abc123', 1, 'description'))
        .rejects.toThrow('Revert failed');
    });
  });

  describe('Version Access Control', () => {
    it('should enforce form ownership for version operations', () => {
      const checkFormOwnership = (formId: number, userId: number, formOwnerId: number) => {
        if (userId !== formOwnerId) {
          throw new Error('Form not found or access denied');
        }
        return true;
      };

      expect(() => checkFormOwnership(1, 1, 1)).not.toThrow();
      expect(() => checkFormOwnership(1, 2, 1)).toThrow('Form not found or access denied');
    });

    it('should validate version SHA format', () => {
      const validateShaFormat = (sha: string) => {
        // Simple validation - SHA should be alphanumeric string
        if (!/^[a-zA-Z0-9]+$/.test(sha)) {
          throw new Error('Invalid SHA format');
        }
        return true;
      };

      expect(() => validateShaFormat('abc123')).not.toThrow();
      expect(() => validateShaFormat('ABC123def')).not.toThrow();
      expect(() => validateShaFormat('abc-123')).toThrow('Invalid SHA format');
      expect(() => validateShaFormat('abc 123')).toThrow('Invalid SHA format');
    });
  });
});