/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Animated
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

import { icons, images, COLORS, FONTS, SIZES } from '../constants';

const Restaurant = ({route, navigation}) => {

    const scrollX = new Animated.Value(0);
    const [restaurant, setRestaurant] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        let {item, currentLocation} = route.params;
        //console.log(item);
        setRestaurant(item);
        setCurrentLocation(currentLocation);
    });

    function editOrder(action, menuId, price) {
        let orderList = orderItems.slice();
            let item = orderList.filter(a => a.menuId == menuId);
        if(action === "+") {
            
            if(item.length > 0) {
                let newQty = item[0].qty + 1;
                item[0].qty = newQty;
                item[0].total = item[0].qty * price;
            } else {
                const newItem = {
                    menuId: menuId,
                    qty: 1,
                    price: price,
                    total: price
                }
                orderList.push(newItem);
            }
            setOrderItems(orderList);
        } else {
            if(item.length > 0) {
                if(item[0]?.qty > 0) {
                    let newQty = item[0].qty - 1;
                    item[0].qty = newQty;
                    item[0].total = newQty * price;
                }
            }
        }
    };
    function getOrderQty(menuId) {
        let orderItems = orderItems.filter(a => a.menuId == menuId)

        if(orderItems.length > 0) {
            return orderItems[0].qty;
        }
        return 0;
    };
    function getBasketItemCount() {
        let itemCount = orderItems.reduce((a, b) => a + (b.qty || 0), 0);
        return itemCount;
    };
    function sumOrder() {

    }
    function renderHeader() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingLeft: SIZES.padding * 2,
                        justifyContent: 'center',

                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={icons.back}
                        resizeMode='contain'
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </TouchableOpacity>
                {/*Restaurant Name Section*/}

                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <View
                        style={{
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: SIZES.padding * 3,
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.lightGray3
                        }}
                    >
                        <Text style={{ ...FONTS.h3 }}>{restaurant?.name}</Text>

                    </View>
                </View>
                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingRight: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        source={icons.list}
                        resizeMode='contain'
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />

                </TouchableOpacity>
            </View>
        );
    };
    function renderFoodInfo() {
        //console.log(restaurant.menu);
        return (
            <Animated.ScrollView
                horizontal
                pagingEnabled
                scrollEventThrottle={16}
                snapToAlignment='center'
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([
                    {nativeEvent: {contentOffset: {x: scrollX}}}
                ], {useNativeDriver: false})}

            >
                {
                    restaurant?.menu.map((item, index) => (
                        <View
                            key={`menu-${item}`}
                            style={{alignItems: 'center'}}
                        >
                            <View style={{ height: SIZES.height * 0.35 }}>
                                {/**Food Image */}
                                <Image
                                    source={item.photo}
                                    resizeMode='cover'
                                    style={{
                                        height: '100%',
                                        width: SIZES.width
                                    }}
                                />
                                {/**quantity */}
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: -20,
                                        width: SIZES.width,
                                        height: 50,
                                        justifyContent: 'center',
                                        flexDirection: 'row'
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            width: 50,
                                            backgroundColor: COLORS.white,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderTopLeftRadius: 25,
                                            borderBottomLeftRadius: 25
                                        }}
                                        onPress={() => editOrder("-", item.menuId, item.price)}
                                    >
                                        <Text style={{ ...FONTS.body1 }}>-</Text>
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            width: 50,
                                            backgroundColor: COLORS.white,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Text style={{ ...FONTS.h2 }}>{getOrderQty(item.menuId)}</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={{
                                            width: 50,
                                            backgroundColor: COLORS.white,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderTopRightRadius: 25,
                                            borderBottomRightRadius: 25
                                        }}
                                        onPress={() => editOrder("+", item.menuId, item.price)}
                                    >
                                        <Text style={{ ...FONTS.body1 }}>+</Text>

                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/**Name & Description */}
                            <View
                                style={{
                                    width: SIZES.width,
                                    alignItems: 'center',
                                    marginTop: 15,
                                    paddingHorizontal: SIZES.padding * 2
                                }}
                            >
                                <Text style={{
                                    marginVertical: 10,
                                    textAlign: 'center',
                                    ...FONTS.h2
                                }}>{item.name}</Text>
                                <Text style={{ ...FONTS.body3 }}>{item.description}</Text>
                                {/**Calories */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginTop: 10,
                                        
                                    }}
                                >
                                    <Image
                                        source={icons.fire}
                                        style={{
                                            width: 20,
                                            height: 20,
                                            marginRight: 10
                                        }}
                                    />
                                    <Text style={{
                                        ...FONTS.body3, color: COLORS.darkgray
                                    }}>{item.calories.toFixed(2)} cal</Text>
                                </View>
                            </View>
                        </View>
                    ))
                }

            </Animated.ScrollView>
        );
    };
    function renderDots() {
        const dotPosition = Animated.divide(scrollX, SIZES.width);
        return (
            <View style={{ height: 30 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: SIZES.padding
                    }}
                >
                    {restaurant?.menu.map((item, index) => {
                        const opacity = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp'

                        });
                        const dotSize = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [SIZES.base * 0.8, 10, SIZES.base * 0.8],
                            extrapolate: 'clamp'
                        });
                        const dotColor = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [COLORS.darkgray, COLORS.primary, COLORS.darkgray]
                        });

                        return (
                            <Animated.View
                                key={`dot-${index}`}
                                opacity={opacity}
                                style={{
                                    borderRadius: SIZES.radius,
                                    marginHorizontal: 6,
                                    width: dotSize,
                                    height: dotSize,
                                    backgroundColor: dotColor
                                }}
                            />

                        );
                    })}

                </View>
            </View>
        );
    }
    function renderOrder() {
        return (
            <View>
                {
                    renderDots()
                }
                <View
                    style={{
                        backgroundColor: COLORS.white,
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: SIZES.padding * 2,
                            paddingHorizontal: SIZES.padding * 3,
                            borderBottomColor: COLORS.lightGray2,
                            borderBottomWidth: 1
                        }}
                    >
                        <Text style={{ ...FONTS.h3 }}>{getBasketItemCount()} items in cart</Text>
                        <Text style={{ ...FONTS.h3 }}>${sumOrder()}</Text>
                    </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingVertical: SIZES.padding * 2,
                                paddingHorizontal: SIZES.padding * 3
                            }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={icons.pin}
                                    resizeMode='contain'
                                    style={{
                                        width: 20,
                                        height: 20,
                                        tintColor: COLORS.darkgray
                                    }}
                                />
                                <Text style={{ marginLeft: SIZES.padding, ...FONTS.h4 }}>Location</Text>

                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={icons.mastercard}
                                    resizeMode='contain'
                                    style={{
                                        height: 20,
                                        width: 20,
                                        tintColor: COLORS.darkgray
                                    }}
                                />
                                <Text style={{ marginLeft: SIZES.padding, ...FONTS.h4 }}>8888</Text>
                            </View>
                        </View>

                        {/**Order button */}
                        <View
                            style={{
                                padding: SIZES.padding * 2,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    width: SIZES.width * 0.9,
                                    padding: SIZES.padding,
                                    backgroundColor: COLORS.primary,
                                    alignItems: 'center',
                                    borderRadius: SIZES.radius
                                }}
                            >
                                <Text style={{ color: COLORS.white, ...FONTS.h2 }}>Order</Text>

                            </TouchableOpacity>

                        </View>
                </View>
                {isIphoneX() &&
                    <View 
                        style={{
                            position: 'absolute',
                            bottom: -34,
                            left: 0,
                            right: 0,
                            height: 34,
                            backgroundColor: COLORS.white
                        }}
                    >
                    </View>
                }
            </View>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderFoodInfo()}
            {renderOrder()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray2,
    }
});

export default Restaurant;
