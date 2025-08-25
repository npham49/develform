#!/usr/bin/env tsx

/**
 * Type Generation Watcher
 * 
 * Watches for changes in the backend schema and routes and automatically 
 * regenerates shared types when changes are detected.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const WATCH_PATHS = [
  'server/src/db/schema.ts',
  'server/src/routes/',
  'server/src/services/',
];

function regenerateTypes() {
  console.log('🔄 Detected backend changes, regenerating types...');
  try {
    execSync('npm run types:generate -- --force', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('✅ Types regenerated successfully');
  } catch (error) {
    console.error('❌ Failed to regenerate types:', error);
  }
}

function startWatcher() {
  console.log('👀 Watching for backend changes...');
  console.log('Monitored paths:');
  WATCH_PATHS.forEach(p => console.log(`   - ${p}`));
  console.log('');
  
  WATCH_PATHS.forEach(watchPath => {
    const fullPath = path.join(process.cwd(), watchPath);
    
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        // Watch directory recursively
        fs.watch(fullPath, { recursive: true }, (eventType, filename) => {
          if (filename && (filename.endsWith('.ts') || filename.endsWith('.js'))) {
            console.log(`📝 Changed: ${path.join(watchPath, filename)}`);
            regenerateTypes();
          }
        });
      } else {
        // Watch individual file
        fs.watch(fullPath, (eventType, filename) => {
          console.log(`📝 Changed: ${watchPath}`);
          regenerateTypes();
        });
      }
    }
  });
  
  console.log('Press Ctrl+C to stop watching...');
  
  // Keep the process alive
  process.on('SIGINT', () => {
    console.log('\n👋 Stopped watching for changes');
    process.exit(0);
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startWatcher();
}