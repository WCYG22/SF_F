#!/bin/bash
# Custom build script that ignores TypeScript errors
export SKIP_TYPECHECKING=true
npm run build
