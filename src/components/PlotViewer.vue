<script setup>
import { computed, ref, toValue, watch, watchEffect } from "vue";
import Plotly from "../setup-plotly";
import { downloadLink } from "../services/apiClient";

import { ZoomManagement, DataFiltering } from "@abi-software/plotcomponents";
import {
  applyFilter,
  extractTitles,
  convertToPlotlyData,
} from "@abi-software/plottypes";

const {plotInfo, file, datasetInfo} = defineProps({
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

// const plotInfo = ref(props.plotInfo);
// const file = ref(props.file); // Not needed until plot metadata section is added.
// const datasetInfo = ref(props.datasetInfo);

let plotly_data = ref(null);
let plotly_layout = ref(null);
let plotly_options = ref(null);

const filteredx = ref([]);
const filteredy = ref([]);
const titles = ref({ x: [], y: [] });
const resetData = ref(false);
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

watchEffect(() => {
  console.log("watch effect datasetInfo:", datasetInfo)
})
watchEffect(() => {
  console.log("Watch effect PlotViewer.vue:")
  console.log(plotInfo);
  console.log(datasetInfo)
});

watch([() => plotInfo, () => datasetInfo], () => {
  resetData.value = true;
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
  console.log("now:", toValue(resetData));
  Promise.allSettled(apiCalls).then(responses => {
    source_uri.value = responses[0].value;
    console.log("source uri:", source_uri.value)
    if (responses.length > 1) {
      supplemental_data.value = [{ uri: responses[1].value }];
    }
  });
}, {immediate: true});

watch([source_uri, metadata, supplemental_data], () => {
  convertToPlotlyData(
    source_uri,
    metadata,
    supplemental_data,
    plotly_data,
    plotly_layout,
    plotly_options,
    handlePlotDataError
  );
});

function onFilterClicked() {
  filtered_plotly_data.value = applyFilter(plotly_data, metadata, {
    x: toValue(filteredx),
    y: toValue(filteredy),
  });
}

// watch(plotly_plot_ref, () => {
//   console.log("---- watching this thing here:", plotly_plot_ref.value)
//   console.log(plotly_plot_ref.value.layout)
// })

watch([plotly_data, plotly_layout, filtered_plotly_data, titles], () => {
  if (!toValue(isLoading)) {
    extractTitles(plotly_data, metadata, titles);
    console.log("plotly layout:", toValue(plotly_layout));
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
          // "zoomIn2d",
          // "zoomOut2d",
          "autoScale2d",
          // "resetScale2d",
        ],
        ...toValue(plotly_options),
      }
    ).then(r => {
      // Object.assign(plotly_plot, r)
      plotly_plot_ready.value = true;
      // resetData.value = false;
      console.log("and now:", toValue(resetData));
      // console.log("layout:", toValue(plotly_layout))
      // console.log(typeof r)
      // console.log(toValue(plotly_plot_ref))
      // plotly_plot.value = {element: r}
      // console.log(toValue(plotly_plot_ref))
    });
  }
});
</script>

<template>
  <div class="plot-viewer-page">
    <div class="container p-0">
      <div class="plot-container">
        <div id="plotly_graph" ref="plotly_plot_ref" class="vue-plotly" />
        <!-- <plot-vuer
          v-if="source_url"
          :data-source="{ url: source_url }"
          :metadata="metadata"
          :supplemental-data="supplemental_data"
        /> -->
        <data-filtering
          v-model:selection-x="filteredx"
          v-model:selection-y="filteredy"
          :titles="titles"
          @filter-clicked="onFilterClicked"
        ></data-filtering>
        <zoom-management
          :plotlyPlot="plotly_plot_ref"
          :plotlyLayout="plotly_layout"
          :plotlyPlotReady="plotly_plot_ready"
          :resetData="resetData"
        ></zoom-management>
      </div>
      <!-- <plot-viewer-metadata
        :plotType="plotType"
        :file="file"
        :datasetInfo="datasetInfo"
      /> -->
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
