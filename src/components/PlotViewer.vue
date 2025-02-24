<script setup>
import { computed, ref, toValue, watch } from "vue";
import Plotly from "../setup-plotly";
import { downloadLink } from "../services/apiClient";

import { ZoomManagement, DataFiltering } from "@abi-software/plotcomponents";
import {
  applyFilter,
  extractTitles,
  convertToPlotlyData,
} from "@abi-software/plotdatahelpers";

const { plotInfo, file, datasetInfo } = defineProps({
  plotInfo: {
    type: Object,
    requried: true,
  },
  file: {
    type: Object,
    required: true,
  },
  datasetInfo: {
    type: Object,
    required: true,
  },
});

let plotly_data = ref(null);
let plotly_layout = ref(null);
let plotly_options = ref(null);

const filteredx = ref([]);
const filteredy = ref([]);
const titles = ref({ x: [], y: [] });
const dataReset = ref(true);
const plotly_plot_ref = ref(null);
const plotly_plot_ready = ref(false);
const source_uri = ref({});
const supplemental_data = ref([]);
const metadata = ref({});

let filtered_plotly_data = ref(null);

const isLoading = computed(
  () => toValue(plotly_plot_ref) === null || toValue(plotly_data) === null
);

function handlePlotDataError(error) {
  if (error.message === "Not Found") {
    console.log(
      "Some of the data for the plot is missing or incorrectly referenced."
    );
  } else {
    console.log("An unknown error occured:", error.message);
  }
}

function isArrayWithEmptyString(arr) {
  return arr.length === 1 && arr[0] === "";
}

watch(
  [() => plotInfo, () => datasetInfo],
  () => {
    // dataReset.value = false;
    metadata.value = JSON.parse(
      toValue(plotInfo).datacite.supplemental_json_metadata.description
    );
    let apiCalls = [
      downloadLink(
        `${toValue(datasetInfo).id}/files/${
          toValue(plotInfo).datacite.dataset.path
        }`,
        "prd-sparc-discover50-use1"
      ),
    ];
    if (
      toValue(plotInfo).datacite.isSupplementedBy.path.length > 0 &&
      !isArrayWithEmptyString(toValue(plotInfo).datacite.isSupplementedBy.path)
    ) {
      apiCalls.push(
        downloadLink(
          `${toValue(datasetInfo).id}/files/${
            toValue(plotInfo).datacite.isSupplementedBy.path[0]
          }`,
          "prd-sparc-discover50-use1"
        )
      );
    }
    supplemental_data.value = [];
    Promise.allSettled(apiCalls).then(responses => {
      if (responses[0].value.status === 200) {
        source_uri.value = responses[0].value.data;
        if (responses.length > 1 && responses[1].value.status === 200) {
          supplemental_data.value = [{ uri: responses[1].value.data }];
        }
      }
    });
  },
  { immediate: true, deep: true }
);

watch(source_uri, () => {
  convertToPlotlyData(
    toValue(source_uri),
    toValue(metadata),
    toValue(supplemental_data),
    plotly_data,
    plotly_layout,
    plotly_options,
    handlePlotDataError
  );
});

function onFilterClicked() {
  filtered_plotly_data.value = applyFilter(plotly_data, toValue(metadata), {
    x: toValue(filteredx),
    y: toValue(filteredy),
  });
}

function updatePlot() {
  Plotly.react(
    toValue(plotly_plot_ref),
    filtered_plotly_data.value
      ? toValue(filtered_plotly_data)
      : toValue(plotly_data),
    toValue(plotly_layout),
    {
      loading: false,
      scrollZoom: true,
      // displayModeBar: false,
      displaylogo: false,
      modeBarButtonsToRemove: [
        "zoom",
        "pan2d",
        "zoomIn2d",
        "zoomOut2d",
        "autoScale2d",
        "resetScale2d",
      ],
      ...toValue(plotly_options),
    }
  ).then(() => {
    plotly_plot_ready.value = true
  });
}

watch([plotly_layout], () => {
  if (!toValue(isLoading) && toValue(plotly_layout).xaxis !== undefined) {
    updatePlot();
  }
});

watch(
  [plotly_data, filtered_plotly_data],
  () => {
    if (!toValue(isLoading)) {
      dataReset.value = false;
      setTimeout(() => {
        dataReset.value = true;
      }, 1);

      // plotly_plot_ready.value = true;

      extractTitles(plotly_data, toValue(metadata), titles);
      updatePlot();
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="plot-viewer-page">
    <div class="container p-0">
      <div class="plot-container">
        <div id="plotly_graph" ref="plotly_plot_ref" class="vue-plotly" />
        <data-filtering
          v-model:selection-x="filteredx"
          v-model:selection-y="filteredy"
          :titles="titles"
          @filter-clicked="onFilterClicked"
        ></data-filtering>
        <zoom-management
          v-model="plotly_layout"
          :plotlyPlot="plotly_plot_ref"
          :plotlyPlotReady="plotly_plot_ready"
          :dataReset="dataReset"
        ></zoom-management>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@abi-software/plotcomponents/dist/plotcomponents.css";
.plot-container {
  margin-top: 1.5rem;
  height: 90vh;
  max-width: calc(100% - 3rem);
}

.container {
  padding: 0;
}
</style>
