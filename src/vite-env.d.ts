/// <reference types="vite/client" />

declare module '*.js';

declare module '../api/api/teacherApi';

declare module '../api/api/teacherApi.js' {
    export const getPublicTeachers: any;
}
