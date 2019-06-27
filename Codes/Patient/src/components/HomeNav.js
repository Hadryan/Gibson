import Medicine from '../screens/Medicine';
import History from '../screens/History';
import TestResult from '../screens/TestResult';
import Emergency from '../screens/Emergency';
import Doctors from '../screens/Doctors';
import Home from '../screens/Home';
import { createStackNavigator} from 'react-navigation';

const HomeNav= createStackNavigator({
        Home,
        Medicine,
        History,
        TestResult,
        Doctors,
        Emergency,
        },{
        headerMode:'none',
    })

export default HomeNav