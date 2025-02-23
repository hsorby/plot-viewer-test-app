<script setup>
import { computed, ref, toValue, watch, watchEffect } from "vue";

import PlotViewer from "./components/PlotViewer.vue";

const id = ref(0);

let file = ref({path: "pass-through-for-details-section"});
let datasetInfo = ref({ uri: "", id: "", name: "", version: "" });
let plotInfo = ref({
  datacite: {
    supplemental_json_metadata: {
      description: "",
    },
    isSupplementedBy: { path: [""] },
    dataset: { path: "" },
  },
});

watch(
  id,
  value => {
    // let apiCalls = [];
    plotInfo.value.datacite.dataset.path =
      "derivative/Effects_of_SNS_on_CaT_Amplitude_in_mouse.csv";
    plotInfo.value.datacite.isSupplementedBy.path = [""]
    datasetInfo.value.id = "212";
    let m = {
      version: "1.1.0",
      type: "plot",
      attrs: {
        style: "timeseries",
      },
    };
    switch (value) {
      case 1:
        plotInfo.value.datacite.dataset.path =
          "derivative/sub-Pig-013/Pig013_ICNS15_Blood_gases.csv";
        datasetInfo.value.id = "26";
        m = {
          version: "1.1.0",
          type: "plot",
          attrs: {
            style: "timeseries",
            "y-axes-columns": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
          },
        };

        break;
      case 2:
        plotInfo.value.datacite.dataset.path =
          "derivative/sub-Pig-013/Pig013_ICNS15_Hemodynamics.csv";
        datasetInfo.value.id = "26";
        m = {
          version: "1.1.0",
          type: "plot",
          attrs: {
            style: "timeseries",
            "x-axis-column": 2,
            "y-axes-columns": [3, 4, 5, 6],
          },
        };

        break;
      case 3:
        plotInfo.value.datacite.dataset.path =
          "primary/sub-cat8/perf-2-cat8/DamaserSPARC_urodynamics_1-10_8_2019-8_27_13_AM.csv";
        datasetInfo.value.id = "120";
        plotInfo.value.datacite.isSupplementedBy.path =
          ["derivative/sub-cat8/perf-2-cat8/Cat8_HeaderData.csv"];
        m = {
          version: "1.2.0",
          type: "plot",
          attrs: { style: "timeseries", "no-header": true },
        };

        break;
      case 4:
        plotInfo.value.datacite.dataset.path =
          "primary/sub-10/sam-1-10/pressure-preconditioning.csv";
        datasetInfo.value.id = "142";
        plotInfo.value.datacite.isSupplementedBy.path =
          [
            "derivative/header-data/sub-10/sub-10-sam-1/pressure-preconditioning_header_file.csv",
          ];
        m = {
          version: "1.1.0",
          type: "plot",
          attrs: {
            style: "timeseries",
            "x-axis-column": 2,
            "y-axes-columns": [3, 4, 5, 6, 7, 8, 9, 10],
          },
        };

        break;
      case 5:
        plotInfo.value.datacite.dataset.path =
          "derivative/perf-T12-stim_30Hz_PT_afferent-efferent/stim_30Hz_PT_afferent-efferent_manometry.csv";
        datasetInfo.value.id = "149";
        m = {
          version: "1.2.0",
          type: "plot",
          attrs: {
            style: "heatmap",
            logScale: true,
            layout: { margin: { t: 55, l: 200, r: 55, b: 200, pad: 4 } },
          },
        };

        break;
    }
    plotInfo.value.datacite.supplemental_json_metadata.description =
      JSON.stringify(m);
    console.log("id:", id.value)
    console.log(datasetInfo.value)
    // apiCalls.push(
    //   downloadLink(
    //     `${datasetId}/files/${filePath}`,
    //     "prd-sparc-discover50-use1"
    //   )
    // );
    // if (s) {
    //   apiCalls.push(
    //     downloadLink(`${datasetId}/files/${s}`, "prd-sparc-discover50-use1")
    //   );
    // }
    // Promise.allSettled(apiCalls).then(responses => {
    //   console.log("started:", source_uri.value)
    //   source_uri.value = responses[0].value;
    //   console.log("changed:", source_uri.value)
    //   if (responses.length > 1) {
    //     supplemental_data.value = [{ uri: responses[1].value }];
    //   }
    // });
  },
  { immediate: true }
);

// plot_annotation.value.supplemental_json_metadata.description = computed(() => {
//   let m = {
//     version: "1.1.0",
//     type: "plot",
//     attrs: {
//       style: "timeseries",
//     },
//   };
//   switch (id.value) {
//     case 1:
//       m = {
//         version: "1.1.0",
//         type: "plot",
//         attrs: {
//           style: "timeseries",
//           "y-axes-columns": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
//         },
//       };
//       break;
//     case 2:
//       m = {
//         version: "1.1.0",
//         type: "plot",
//         attrs: {
//           style: "timeseries",
//           "x-axis-column": 2,
//           "y-axes-columns": [3, 4, 5, 6],
//         },
//       };
//       break;
//     case 3:
//       m = {
//         version: "1.2.0",
//         type: "plot",
//         attrs: { style: "timeseries", "no-header": true },
//       };
//       break;
//     case 4:
//       m = {
//         version: "1.1.0",
//         type: "plot",
//         attrs: {
//           style: "timeseries",
//           "x-axis-column": 2,
//           "y-axes-columns": [3, 4, 5, 6, 7, 8, 9, 10],
//         },
//       };
//       break;
//     case 5:
//       m = {
//         version: "1.2.0",
//         type: "plot",
//         attrs: {
//           style: "heatmap",
//           logScale: true,
//           layout: { margin: { t: 55, l: 200, r: 55, b: 200, pad: 4 } },
//         },
//       };
//       break;
//   }
//   return JSON.stringify(m);
// });
</script>

<template>
  Load test data id:
  <button v-for="i in 5" @click="id = i">{{ i }}</button>Active data {{ id }}
  <plot-viewer
    :plotInfo="plotInfo"
    :file="file"
    :datasetInfo="datasetInfo"
  ></plot-viewer>
</template>

<style lang="scss"></style>
