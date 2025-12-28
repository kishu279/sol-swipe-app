// import { MOCK_DATA } from '@/constants/scroll-data'

// import { useState } from 'react'
// import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'

// const { height: windowHeight } = Dimensions.get('window')

// export default function ScrollLayout() {
//   const [itemHeight, setItemHeight] = useState<number>(0)

//   return (
//     <SafeAreaView style={{ flex: 1 }} edges={['top']}>
//       <View
//         style={{ flex: 1, backgroundColor: '#000' }}
//         onLayout={(e) => {
//           // const { height } = e.nativeEvent.layout
//           const { height: windowHeight } = Dimensions.get('window')

//           if (windowHeight > 0 && Math.abs(windowHeight - itemHeight) > 1) {
//             setItemHeight(windowHeight)
//           }
//         }}
//       >
//         {itemHeight > 0 && (
//           <FlatList
//             data={MOCK_DATA}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <View style={[styles.item, { height: itemHeight }]}>
//                 {/* Placeholder for Image - using color for now to visualize paging */}
//                 <View
//                   style={{
//                     ...StyleSheet.absoluteFillObject,
//                     backgroundColor: '#222',
//                     margin: 12,
//                     borderRadius: 20,
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                   }}
//                 >
//                   <Text style={styles.text}>{item.title}</Text>
//                   <Text style={{ color: '#aaa', marginTop: 10 }}>{item.description}</Text>
//                   <Text style={{ color: '#666', marginTop: 20, fontSize: 10 }}>ID: {item.id}</Text>
//                 </View>
//               </View>
//             )}
//             pagingEnabled
//             decelerationRate="fast"
//             showsVerticalScrollIndicator={false}
//             snapToInterval={itemHeight}
//             snapToAlignment="start"
//             disableIntervalMomentum
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   item: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//   },
//   text: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// })
