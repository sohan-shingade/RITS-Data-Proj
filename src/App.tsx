/// app.js
import { Flex, Heading, HStack, Image, Spacer, Text, VStack } from "@chakra-ui/react";
import DeckGL from "deck.gl";
import React, { useEffect } from 'react';
import { StaticMap } from "react-map-gl";
import Map, { MapProps } from './Map';

// Set your mapbox access token here

// Viewport settings
const INITIAL_VIEW_STATE = {
  latitude: 37.7749,
  longitude: -122.4194,
  zoom: 11,
  pitch: 60,
  bearing: 40
};


const APIKEY = 'pk.eyJ1Ijoic29oYW4tc2hpbmdhZGUiLCJhIjoiY2t5OWFqZjdsMDRpZjJ1cDgxMm1sM2cydyJ9.PRNLtFIS0nsxNkXFG4qiJw'

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
          <Heading size={'4xl'}>Data of Raisin In The Sun</Heading>
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
      {/* Add a text paragraph block */}
      <Text fontSize={'2xl'} w={'50vw'}>
        These graphs use data from the Census Bureau's 2019 5-year American Community Survey.
        The goal of the data is to provide an understanding for the situation of the Younger Family in a statistical and demogrpahic perspective.
        The data is presented in a way that is easy to understand and interpret, by using 3D maps and charts. 
        The focus of the statistics highlight three seperate topics in <strong>A Raisin In The Sun</strong>: upward mobility, income, and education.
        The first graph show the population of each race in each census tract, while the second shows the amount of people with certain amount of income in each tract. 
        When observing the graphs, there is a correlation between the black dominated tracts and low income tracts. This demonstrates that many black families are not able to achvie upward mobility.
        The third graph shows the percentage of people with a certain level of education in each census tract. This also shows how the black dominated tracts have lower amounts of collage degrees.
        This ties into upward mobility because the black famillies are unable to pay for collage education becasue they tend to havve lower incomes, leading to those who are black to not be able to get high-skilled, high-paying jobs, and thus not be able to achive upward mobility and feed back into the loop of the lower income tracts.
       
      </Text>
      
    </VStack>
  );
}

export default App;