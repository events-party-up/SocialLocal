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
class Terms extends Component {

    getHeader(){
        return(
            <Content style={Object.assign({}, styles.header, {padding: 20})}>
                
                <Text style={styles.regulartext}>Last updated: August 01, 2017</Text>
                <View style={{alignSelf:'stretch', height:10}}></View>
                <Text style={styles.regulartext}>Please read these Terms and Conditions ("Terms", "Terms and Conditions")
carefully before using the Socialvite mobile application (the "Service")
operated by Socialvite, Inc. ("us", "we", or "our").</Text>
                <View style={{alignSelf:'stretch', height:10}}></View>
                <Text style={styles.regulartext}>Your access to and use of the Service is conditioned upon your acceptance of
and compliance with these Terms. These Terms apply to all visitors, users and
others who wish to access or use the Service.</Text>
                <View style={{alignSelf:'stretch', height:10}}></View>
                <Text style={styles.regulartext}>By accessing or using the Service you agree to be bound by these Terms. If you
disagree with any part of the terms then you do not have permission to access
the Service.</Text>
                <View style={{alignSelf:'stretch', height:10}}></View>
                <Text style={styles.heading1}>Communications</Text>
                <Text style={styles.regulartext}>By creating an Account on our service, you agree to subscribe to newsletters,
marketing or promotional materials and other information we may send. However,
you may opt out of receiving any, or all, of these communications from us by
following the unsubscribe link or instructions provided in any email we send.</Text>
                
                <View style={{alignSelf:'stretch', height:10}}></View>
                <Text style={styles.heading1}>Content</Text>
                
                <Text style={styles.regulartext}>Our Service allows you to post, link, store, share and otherwise make
available certain information, text, graphics, videos, or other material
("Content"). You are responsible for the Content that you post on or through
the Service, including its legality, reliability, and appropriateness.</Text>
                <Text style={styles.regulartext}>By posting Content on or through the Service, You represent and warrant that:
(i) the Content is yours (you own it) and/or you have the right to use it and
the right to grant us the rights and license as provided in these Terms, and
(ii) that the posting of your Content on or through the Service does not
violate the privacy rights, publicity rights, copyrights, contract rights or
any other rights of any person or entity. We reserve the right to terminate
the account of anyone found to be infringing on a copyright.
</Text>

<View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.regulartext}>You retain any and all of your rights to any Content you submit, post or
display on or through the Service and you are responsible for protecting those
rights. We take no responsibility and assume no liability for Content you or
any third party posts on or through the Service. However, by posting Content
using the Service you grant us the right and license to use, modify, perform,
display, reproduce, and distribute such Content on and through the Service.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
            
            <Text style={styles.regulartext}>Socialvite, Inc. has the right but not the obligation to monitor and edit all
Content provided by users.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.regulartext}>In addition, Content found on or through this Service are the property of
Socialvite, Inc. or used with permission. You may not distribute, modify,
transmit, reuse, download, repost, copy, or use said Content, whether in whole
or in part, for commercial purposes or for personal gain, without express
advance written permission from us.
</Text>


<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Accounts</Text>
            <Text style={styles.regulartext}>When you create an account with us, you guarantee that you are above the age
of 18, and that the information you provide us is accurate, complete, and
current at all times. Inaccurate, incomplete, or obsolete information may
result in the immediate termination of your account on the Service.</Text>


<View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.regulartext}>You are responsible for maintaining the confidentiality of your account and
password, including but not limited to the restriction of access to your
computer and/or account. You agree to accept responsibility for any and all
activities or actions that occur under your account and/or password, whether
your password is with our Service or a third-party service. You must notify us
immediately upon becoming aware of any breach of security or unauthorized use
of your account.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.regulartext}>You may not use as a username the name of another person or entity or that is
not lawfully available for use, a name or trademark that is subject to any
rights of another person or entity other than you, without appropriate
authorization. You may not use as a username any name that is offensive,
vulgar or obscene.</Text>

<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Intellectual Property</Text>
            <Text style={styles.regulartext}>
The Service and its original content (excluding Content provided by users),
features and functionality are and will remain the exclusive property of
Socialvite, Inc. and its licensors. The Service is protected by copyright,
trademark, and other laws of both the United States and foreign countries. Our
trademarks and trade dress may not be used in connection with any product or
service without the prior written consent of Socialvite, Inc.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Links To Other Web Sites</Text>


            <Text style={styles.regulartext}>Our Service may contain links to third party web sites or services that are
not owned or controlled by Socialvite, Inc.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Business Transaction</Text>
            <Text style={styles.regulartext}>Socialvite, Inc. has no control over, and assumes no responsibility for the
content, privacy policies, or practices of any third party web sites or
services. We do not warrant the offerings of any of these entities/individuals
or their websites.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Security</Text>
            <Text style={styles.regulartext}>You acknowledge and agree that Socialvite, Inc. shall not be responsible or
liable, directly or indirectly, for any damage or loss caused or alleged to be
caused by or in connection with use of or reliance on any such content, goods
or services available on or through any such third party web sites or
services.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.regulartext}>We strongly advise you to read the terms and conditions and privacy policies
of any third party web sites or services that you visit.</Text>
            <View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.heading1}>Termination</Text>
            <Text style={styles.regulartext}>We may terminate or suspend your account and bar access to the Service
immediately, without prior notice or liability, under our sole discretion, for
any reason whatsoever and without limitation, including but not limited to a
breach of the Terms.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.regulartext}>If you wish to terminate your account, you may simply discontinue using the
Service.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Children's Privacy</Text>
            <Text style={styles.regulartext}>All provisions of the Terms which by their nature should survive termination
shall survive termination, including, without limitation, ownership
provisions, warranty disclaimers, indemnity and limitations of liability.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>

<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Indemnification</Text>
            <Text style={styles.regulartext}>You agree to defend, indemnify and hold harmless Socialvite, Inc. and its
licensee and licensors, and their employees, contractors, agents, officers and
directors, from and against any and all claims, damages, obligations, losses,
liabilities, costs or debt, and expenses (including but not limited to
attorney's fees), resulting from or arising out of a) your use and access of
the Service, by you or any person using your account and password; b) a breach
of these Terms, or c) Content posted on the Service.</Text>

<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Limitation Of Liability</Text>

            <Text style={styles.regulartext}>In no event shall Socialvite, Inc. , nor its directors, employees, partners,
agents, suppliers, or affiliates, be liable for any indirect, incidental,
special, consequential or punitive damages, including without limitation, loss
of profits, data, use, goodwill, or other intangible losses, resulting from
(i) your access to or use of or inability to access or use the Service; (ii)
any conduct or content of any third party on the Service; (iii) any content
obtained from the Service; and (iv) unauthorized access, use or alteration of
your transmissions or content, whether based on warranty, contract, tort
(including negligence) or any other legal theory, whether or not we have been
informed of the possibility of such damage, and even if a remedy set forth
herein is found to have failed of its essential purpose.</Text>

<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Disclaimer</Text>
            <Text style={styles.regulartext}>Your use of the Service is at your sole risk. The Service is provided on an
"AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties
of any kind, whether express or implied, including, but not limited to,
implied warranties of merchantability, fitness for a particular purpose, non-
infringement or course of performance.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
            <Text style={styles.regulartext}>Socialvite, Inc. its subsidiaries, affiliates, and its licensors do not
warrant that a) the Service will function uninterrupted, secure or available
at any particular time or location; b) any errors or defects will be
corrected; c) the Service is free of viruses or other harmful components; or
d) the results of using the Service will meet your requirements.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Exclusions</Text>
            <Text style={styles.regulartext}>Some jurisdictions do not allow the exclusion of certain warranties or the
exclusion or limitation of liability for consequential or incidental damages,
so the limitations above may not apply to you.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Governing Law</Text>
     <Text style={styles.regulartext}>These Terms shall be governed and construed in accordance with the laws of
Delaware, United States, without regard to its conflict of law provisions.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
 <Text style={styles.regulartext}>Our failure to enforce any right or provision of these Terms will not be
considered a waiver of those rights. If any provision of these Terms is held
to be invalid or unenforceable by a court, the remaining provisions of these
Terms will remain in effect. These Terms constitute the entire agreement
between us regarding our Service, and supersede and replace any prior
agreements we might have had between us regarding the Service.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Changes</Text>
 <Text style={styles.regulartext}>We reserve the right, at our sole discretion, to modify or replace these Terms
at any time. If a revision is material we will provide at least 30 days notice
prior to any new terms taking effect. What constitutes a material change will
be determined at our sole discretion.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
 <Text style={styles.regulartext}>By continuing to access or use our Service after any revisions become
effective, you agree to be bound by the revised terms. If you do not agree to
the new terms, you are no longer authorized to use the Service.</Text>
<View style={{alignSelf:'stretch', height:10}}></View>
<Text style={styles.heading1}>Contact Us</Text>
 <Text style={styles.regulartext}>If you have any questions about these Terms, please contact us.</Text>


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


export default Terms