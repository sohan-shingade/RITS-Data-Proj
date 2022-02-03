/// app.js
import React, { useEffect, useState } from 'react';
import Map from './Map';
import { MapProps } from "./Map";
import { HStack, VStack, Spacer, Flex, Heading, Image } from "@chakra-ui/react";

// Set your mapbox access token here

// Viewport settings
const INITIAL_VIEW_STATE = {
  latitude: 37.7749,
  longitude: -122.4194,
  zoom: 11,
  pitch: 60,
  bearing: 40
};



const URL = 'https://raw.githubusercontent.com/bayesimpact/sf_census_tract_geojson/main/2010_sf_census_tracts_without_water_clippings.geojson'
// Data to be used by the LineLayer
const data : Array<MapProps> = [
  {
    data_ids: {
      table_ids: "B02001",
      tableStem: "B02001",
      geo_ids: "16000US0667000,01000US,140|16000US0667000",
      primary_geo_id: "06075016500"
    },
    multiTable: false,
    viewport: INITIAL_VIEW_STATE,
    mapsouce: URL
  },
  {
    data_ids: {
      table_ids: "B19001",
      tableStem: "B19001",
      geo_ids: "16000US0667000,01000US,140|16000US0667000",
      primary_geo_id: "06075016500"
    },
    multiTable: false,
    viewport: INITIAL_VIEW_STATE,
    mapsouce: URL
  },
  // {
  //   data_ids: {
  //     table_ids: "B17001",
  //     tableStem: "B17001",
  //     geo_ids: "16000US0667000,01000US,140|16000US0667000",
  //     primary_geo_id: "06075016500"
  //   },
  //   multiTable: false,
  //   viewport: INITIAL_VIEW_STATE,
  //   mapsouce: URL
  // },
  {
    data_ids: {
      table_ids: "C15002A,C15002B,C15002C,C15002D",
      tableStem: "C15002",
      geo_ids: "140|16000US0667000",
      primary_geo_id: ""
    },
    multiTable: true,
    viewport: INITIAL_VIEW_STATE,
    mapsouce: URL
  },
];



function App() {

    useEffect(() => {
     
      
      const fetchData = async () => {
      
      }
      fetchData().then(() => {
          
      });
  }, [])

  return (
    <VStack p={'3'} alignItems={'center'}>
      {/* Create Title */}
      <HStack>
        <Flex>
          <Heading size={'4xl'}>Raisin In The Sun Data</Heading>
        </Flex>
        <Spacer />
        <Flex>
          <Image boxSize={'28'} objectFit={'contain'} src={'https://upload.wikimedia.org/wikipedia/en/c/c5/RaisinInTheSun.JPG'}  />
          
        </Flex>
      </HStack>
     
      <Flex flexDirection={'column'} alignItems={'flex-start'}>
      {data.map((d, i) => (
        <VStack alignItems={'flex-start'} key={i}>
          <Map data_ids={d.data_ids} multiTable={d.multiTable} viewport={INITIAL_VIEW_STATE} mapsouce={URL}/>
        </VStack>
      ))}
      </Flex>
      
    </VStack>
  );
}

export default App;