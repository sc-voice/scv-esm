# scv-esm
SuttaCentral Voice ES Modules.

The Voice application was originally implemented using CommonJS modules, which are not part of the Javascript language standard.  
Javascript eventually added its [own ES Module design](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). 
The **scv-esm** library is an ES Module that can be used in 
web applications (e.g., Voice, EBT-Vue, Dhammaregen) as well as in 
NodeJS applications (e.g., Voice). 

### Modules

| Module | Notes |
| ----- | :---- |
| BilaraPath | Path names local to bilara-data. E.g., "root/pli/ms/sutta/mn/mn144_root-pli-ms.json") |
| SuttaCentralId | SuttaCentral document ids (e.g., "mn144") |
| SuttaRef | SuttaCentral segment reference (e.g., "mn144/en/sujato:2.1") |
