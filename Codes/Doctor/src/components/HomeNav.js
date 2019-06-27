import Home from '../screens/Home';
import { createStackNavigator} from 'react-navigation';
import Reservations from '../screens/Reservations';
import TestResult from '../screens/TestResult';
import Profile from '../screens/Profile';

const HomeNav= createStackNavigator({
        Home,
        Reservations,
        TestResult,
        Profile
        },{
        headerMode:'none',
    })

export default HomeNav