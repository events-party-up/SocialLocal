import React, {Component} from 'react';

/* Open source modules */
import SplashScreen from 'react-native-splash-screen'
import {View, Image, Text, TouchableHighlight } from 'react-native'
import { Container, Content, Button } from 'native-base';
import { connect } from 'react-redux';

import styles from './styles';
import theme from '../../themes/base-theme';
import baseStyle from '../../themes/base-styles';
const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/Socialvite_BugMark.png');
const Word_Mark  = require('../../../images/Word_Mark.png');
/* Component class */
class Privacy extends Component {

    getHeader(){
        return(
            <Content style={Object.assign({}, styles.header, {padding: 20})}>
                
                <Text style={styles.regulartext}>Last updated: August 01, 2017</Text>
                <View style={{alignSelf:'stretch', height:10}}></View>
                <Text style={styles.regulartext}>Socialvite, Inc. ("us", "we", or "our") operates the Socialvite mobile
application (the "Service"). </Text>
                <View style={{alignSelf:'stretch', height:10}}></View>
                <Text style={styles.regulartext}>This page informs you of our policies regarding the collection, use and
disclosure of Personal Information when you use our Service.</Text>
                <View style={{alignSelf:'stretch', height:10}}></View>
                <Text style={styles.regulartext}>We will not use or share your information with anyone except as described in
this Privacy Policy.</Text>
                <View style={{alignSelf:'stretch', height:10}}></View>
                <Text style={styles.regulartext}>We use your Personal Information for providing and improving the Service. By
using the Service, you agree to the collection and use of information in
accordance with this policy. Unless otherwise defined in this Privacy Policy,
terms used in this Privacy Policy have the same meanings as in our Terms and
Conditions.</Text>
                <View style={{alignSelf:'stretch', height:10}}></View>
                <Text style={styles.heading1}>Information Collection And Use</Text>
                <Text style={styles.regulartext}>While using our Service, we may ask you to provide us with certain personally
identifiable information that can be used to contact or identify you.
Personally identifiable information may include, but is not limited to, your
email address, name, phone number ("Personal Information").</Text>
                <View style={{alignSelf:'stretch', height:10}}></View>
                <Text style={styles.regulartext}>We collect this information for the purpose of providing the Service,
identifying and communicating with you, responding to your requests/inquiries,
servicing your purchase orders, and improving our services.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
                <Text style={styles.heading1}>Log Data</Text>

                <Text style={styles.regulartext}>When you access the Service by or through a mobile device, we may collect
certain information automatically, including, but not limited to, the type of
mobile device you use, your mobile device unique ID, the IP address of your
mobile device, your mobile operating system, the type of mobile Internet
browser you use and other statistics ("Log Data").
</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.regulartext}>In addition, we may use third party services such as Google Analytics that
collect, monitor and analyze this type of information in order to increase our
Service's functionality. These third party service providers have their own
privacy policies addressing how they use such information.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
            
            <Text style={styles.regulartext}>Please see the section regarding Location Information below regarding the use
of your location information and your options.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>


<Text style={styles.heading1}>Location Information</Text>
            <Text style={styles.regulartext}>We may use and store information about your location depending on the
permissions you have set on your device. We use this information to provide
features of our Service, to improve and customize our Service. You can enable
or disable location services when you use our Service at anytime, through your
mobile device settings.</Text>


<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Cookies</Text>
            <Text style={styles.regulartext}>Cookies are files with a small amount of data, which may include an anonymous
unique identifier. Cookies are sent to your browser from a web site and
transferred to your device. We use cookies to collect information in order to
improve our services for you.</Text>


<View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.regulartext}>You can instruct your browser to refuse all cookies or to indicate when a
cookie is being sent. The Help feature on most browsers provide information on
how to accept cookies, disable cookies or to notify you when receiving a new
cookie.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Service Providers</Text>
            <Text style={styles.regulartext}>We may employ third party companies and individuals to facilitate our Service,
to provide the Service on our behalf, to perform Service-related services
and/or to assist us in analyzing how our Service is used.</Text>



<View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.regulartext}>These third parties have access to your Personal Information only to perform
specific tasks on our behalf and are obligated not to disclose or use your
information for any other purpose.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Communications</Text>
            <Text style={styles.regulartext}>
We may use your Personal Information to contact you with newsletters,
marketing or promotional materials and other information that may be of
interest to you. You may opt out of receiving any, or all, of these
communications from us by following the unsubscribe link or instructions
provided in any email we send.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Compliance With Laws</Text>


            <Text style={styles.regulartext}>We will disclose your Personal Information where required to do so by law or
subpoena or if we believe that such action is necessary to comply with the law
and the reasonable requests of law enforcement or to protect the security or
integrity of our Service.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Business Transaction</Text>
            <Text style={styles.regulartext}>If Socialvite, Inc. is involved in a merger, acquisition or asset sale, your
Personal Information may be transferred as a business asset. In such cases, we
will provide notice before your Personal Information is transferred and/or
becomes subject to a different Privacy Policy.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Security</Text>
            <Text style={styles.regulartext}>The security of your Personal Information is important to us, and we strive to
implement and maintain reasonable, commercially acceptable security procedures
and practices appropriate to the nature of the information we store, in order
to protect it from unauthorized access, destruction, use, modification, or
disclosure.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.regulartext}>However, please be aware that no method of transmission over the internet, or
method of electronic storage is 100% secure and we are unable to guarantee the
absolute security of the Personal Information we have collected from you.</Text>
            <View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.heading1}>Links To Other Sites</Text>
            <Text style={styles.regulartext}>Our Service may contain links to other sites that are not operated by us. If
you click on a third party link, you will be directed to that third party's
site. We strongly advise you to review the Privacy Policy of every site you
visit.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.regulartext}>We have no control over, and assume no responsibility for the content, privacy
policies or practices of any third party sites or services.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Children's Privacy</Text>
            <Text style={styles.regulartext}>Only persons age 18 or older have permission to access our Service. Our
Service does not address anyone under the age of 13 ("Children").</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.regulartext}>We do not knowingly collect personally identifiable information from children
under 13. If you are a parent or guardian and you learn that your Children
have provided us with Personal Information, please contact us. If we become
aware that we have collected Personal Information from a children under age 13
without verification of parental consent, we take steps to remove that
information from our servers.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Changes To This Privacy Policy</Text>
            <Text style={styles.regulartext}>This Privacy Policy is effective as of August 01, 2017 and will remain in
effect except with respect to any changes in its provisions in the future,
which will be in effect immediately after being posted on this page.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.regulartext}>We reserve the right to update or change our Privacy Policy at any time and
you should check this Privacy Policy periodically. Your continued use of the
Service after we post any modifications to the Privacy Policy on this page
will constitute your acknowledgment of the modifications and your consent to
abide and be bound by the modified Privacy Policy.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.regulartext}>If we make any material changes to this Privacy Policy, we will notify you
either through the email address you have provided us, or by placing a
prominent notice on our website.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Contact Us</Text>
            <Text style={styles.regulartext}>If you have any questions about this Privacy Policy, please contact us.</Text>


            </Content>
        )
    }

    render(){
        return(
            <Container theme={theme}>
                {this.getHeader()}
                    
            </Container>
        )
    }
}


export default Privacy