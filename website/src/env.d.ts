/// <reference types="astro/client" />

interface Runtime {
  env: {
    TURSO_DATABASE_URL?: string;
    TURSO_AUTH_TOKEN?: string;
    [key: string]: any;
  };
}

declare namespace App {
  interface Locals {
    runtime?: Runtime;
  }
}
