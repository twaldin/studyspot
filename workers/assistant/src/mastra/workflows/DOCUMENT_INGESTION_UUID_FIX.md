# Document Ingestion UUID Error Fix

## Issue
```
[Duplicate Check] Error: {
  code: '22P02',
  details: null,
  hint: null,
  message: 'invalid input syntax for type uuid: "undefined"'
}
```

## Root Cause
The `checkDuplicateStep` was trying to access `inputData.courseId` but it was receiving `undefined` because the workflow wasn't properly mapping data between steps. Each step only has access to:
1. The output of the previous step
2. Data explicitly mapped using `.map()`

## Solution

### Used Mastra's `.map()` Method
Added data mapping between workflow steps to ensure each step receives the required data:

```typescript
.then(downloadAndValidateStep)
.map({
  // Map data from previous steps to checkDuplicateStep input
  fileHash: { step: downloadAndValidateStep, path: 'fileHash' },
  courseId: { initData: true, path: 'courseId' },
})
.then(checkDuplicateStep)
```

### Key Mapping Patterns Used:
1. **From Previous Steps**: `{ step: stepName, path: 'fieldName' }`
2. **From Initial Input**: `{ initData: true, path: 'fieldName' }`
3. **Static Values**: `{ value: 'some-value' }`

### Complete Fix Applied:
```typescript
export const enhancedDocumentIngestionWorkflow = createWorkflow({
  // ... config
})
  .then(trackStartTimeStep)
  .then(downloadAndValidateStep)
  .map({
    // Map required data for duplicate check
    fileHash: { step: downloadAndValidateStep, path: 'fileHash' },
    courseId: { initData: true, path: 'courseId' },
  })
  .then(checkDuplicateStep)
  .map({
    // Map all data needed for branching
    isDuplicate: { step: checkDuplicateStep, path: 'isDuplicate' },
    existingDocId: { step: checkDuplicateStep, path: 'existingDocId' },
    fileBuffer: { step: downloadAndValidateStep, path: 'fileBuffer' },
    fileName: { initData: true, path: 'fileName' },
    fileUrl: { initData: true, path: 'fileUrl' },
    fileType: { initData: true, path: 'fileType' },
    fileHash: { step: downloadAndValidateStep, path: 'fileHash' },
    courseId: { initData: true, path: 'courseId' },
  })
  .branch([
    // ... branching logic
  ])
  .commit();
```

## Key Takeaways

1. **Always map required data between steps** - Steps don't automatically inherit all data
2. **Use `initData: true` for workflow input data** - To access the original input anywhere in the workflow
3. **Reference steps by variable** - Use `step: stepVariable` instead of string IDs
4. **Check step schemas** - Ensure each step's inputSchema matches what you're mapping

## Testing
The document ingestion should now work without UUID errors. The workflow properly passes the courseId through all steps that need it.