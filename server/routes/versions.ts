import { Hono } from 'hono'
import { VersionController } from '../controllers/VersionController'

const versions = new Hono()

// Version routes
versions.get('/forms/:formId/versions', VersionController.getAllFormVersions)
versions.post('/forms/:formId/versions', VersionController.createVersion)
versions.get('/forms/:formId/versions/:versionId', VersionController.getVersion)
versions.put('/forms/:formId/versions/:versionId', VersionController.updateVersion)
versions.get('/forms/:formId/versions/:versionId/schema', VersionController.getVersionSchema)
versions.put('/forms/:formId/versions/:versionId/live', VersionController.makeVersionLive)

export default versions