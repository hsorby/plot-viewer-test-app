# Test Application for Viewing Plots

This repository houses a Vue 3 + Vite test application for viewing plots.
The plotting library it uses is plotly.js.
The purpose of this application is to test (and then implement) the transformation of data, available on the SPARC Portal, into a form for plotyly.js.
To help with this this application uses two other libraries.
One library is for transforming data into a form suitable for consumption by plotly.
The other is a library for providing user interface elements for interacting with the plotted data.

## Retrieve

  git clone --depth 1 https://github.com/hsorby/plot-viewer-test-app

## Deploy

  cd plot-viewer-test-app
  yarn
  yarn dev

## View

  http://localhost:5173/
