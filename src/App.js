import React, {useState} from 'react';
import './App.css';
import { Modal, Affix, BackTop, Button, Col, Collapse, Icon, Input, Row, Typography} from "antd";
import html2pdf from "html2pdf.js";

const { TextArea } = Input;
const { Title } = Typography;
const { Panel } = Collapse;

const styles = {
    container: {
        margin: 15,
    },
    htmlStyle: {
        backgroundColor: 'white',
    },
    cssStyle: {
        backgroundColor: 'white',
    },
    head: {
        margin: '5px 0 20px 0',
    },
    btnRow: {
    },
    btn: {
        margin: '5px 20px 5px 0'
    }
};

const templateValues = {
    htmlMark: '<!DOCTYPE html>',
    htmlHead: '<html lang="zh">',
    headHead: '    <head>',
    headTail: '    </head>',
    bodyHead: '    <body>',
    bodyTail: '    </body>',
    htmlTail: '</html>',
};

let clickDownLoadFileType = 0;
const HTML_TYPE = 0;
const PDF_TYPE = 1;

function App() {
    // head 标签值
    const [headValues, setHeadValues] = useState('        <meta charset=utf-8>' +
                                                    '    <title>在线生成的网页或PDF</title>');
    // 控制显示输入框还是显示生成的网页预览，true 显示输入框，false 显示网页预览
    const [showInputOrPage, setShowInputOrPage] = useState(true);
    // body 标签值
    const [bodyTemplateValues, setBodyTemplateValues] = useState('        <!-- 在这里输入想加在 body 中的 HTML 代码 -->');
    // 输入的 HTML 代码
    const [htmlValues, setHtmlValues] = useState('');
    // 输入的 CSS 代码
    const [cssValues, setCssValues] = useState('');
    // 网页是否在生成中
    const [htmlGeneratedText, setHtmlGeneratedText] = useState('生成并预览网页');
    // 下载按钮禁用状态
    const [downloadBtn, setDownloadBtn] = useState(true);
    // 生成的 HTML 的代码
    const [htmlCode, setHtmlCode] = useState(<h1>网页预览</h1>);
    // 模态框显示情况
    const [modalVisible, setModalVisible] = useState(false);
    const [fileName, setFileName] = useState('test.html');

    return (
        <div style={styles.container}>
            <BackTop>
                <Button shape={'circle-outline'} type={"primary"} size={"large"}>
                    <Icon type="arrow-up"/>
                </Button>
            </BackTop>
            <Affix offsetTop={15} style={styles.head}>
                <Row key={'btnRow2'} style={styles.btnRow}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Collapse>
                            <Panel header={
                                <Typography>
                                    <Title level={4}>
                                        点击展开自定义网页生成模板</Title>
                                </Typography>
                            } key="1">
                                <Input value={templateValues.htmlMark} disabled={true}/>
                                <Input value={templateValues.htmlHead} disabled={true}/>
                                <Input value={templateValues.headHead} disabled={true}/>
                                <TextArea value={headValues} rows={5} onChange={event => setHeadValues(event.target.value)}/>
                                <Input value={templateValues.headTail} disabled={true}/>
                                <Input value={templateValues.bodyHead} disabled={true}/>
                                <TextArea value={bodyTemplateValues} rows={5} onChange={event => {
                                    setBodyTemplateValues(event.target.value);
                                }}/>
                                <Input value={templateValues.bodyTail} disabled={true}/>
                                <Input value={templateValues.htmlTail} disabled={true}/>
                            </Panel>
                        </Collapse>
                    </Col>
                </Row>
                <Row key={'btnRow1'} style={styles.btnRow}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Button style={styles.btn} type={"primary"} onClick={() => {
                            setDownloadBtn(false);
                            setShowInputOrPage(!showInputOrPage);
                            if (htmlGeneratedText === '生成并预览网页') {
                                let tmpCode = templateValues.htmlMark + templateValues.htmlHead + templateValues.headHead + headValues + '<style>' + cssValues + '</style>'
                                    + templateValues.headTail + templateValues.bodyHead + bodyTemplateValues
                                    + htmlValues + templateValues.bodyTail + templateValues.htmlTail;
                                setHtmlCode(tmpCode);
                                // console.log(tmpCode);
                                setHtmlGeneratedText('返回编辑');
                            } else {
                                setHtmlGeneratedText('生成并预览网页');
                                setDownloadBtn(true);
                            }
                        }}>
                            {htmlGeneratedText}
                        </Button>
                        <Button style={styles.btn} type={"primary"} disabled={downloadBtn} onClick={() => {
                            clickDownLoadFileType = HTML_TYPE;
                            setModalVisible(true);
                        }}>
                            下载生成的 HTML 文件到本地
                        </Button>
                        <Button style={styles.btn} type={"primary"} disabled={downloadBtn} onClick={() => {
                            clickDownLoadFileType = PDF_TYPE;
                            setModalVisible(true);
                        }}>
                            生成PDF(使用的js库转换成PDF后可能出现显示不完整)
                        </Button>
                    </Col>
                </Row>
            </Affix>
            <Row style={{
                display: showInputOrPage ? 'block' : 'none',
            }} key={'input'} gutter={16}>
                <Col style={styles.htmlStyle} xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextArea autosize={{
                        minRows: 30,
                    }} placeholder={' 在此输入 Body 块代码'} onChange={event => {
                        let valueTmp = event.target.value;
                        // console.log(valueTmp);
                        setHtmlValues(valueTmp);
                        if (valueTmp === '') {
                            setDownloadBtn(true);
                        }
                    }}/>
                </Col>
                <Col style={styles.cssStyle} xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextArea autosize={{
                        minRows: 30,
                    }} placeholder={' 在此输入 CSS 代码'} onChange={event => {
                        let valueTmp = event.target.value;
                        // console.log(valueTmp);
                        setCssValues(valueTmp);
                        if (valueTmp === '') {
                            setDownloadBtn(true);
                        }
                    }}/>
                </Col>
            </Row>
            <iframe frameBorder={0} srcDoc={htmlCode} style={{
                display: !showInputOrPage ? 'block' : 'none',
                width: '100%',
                height: '100%',
                minHeight: 800,
                overflowY: 'hidden',
            }}>
            </iframe>
            <Modal
                title="Vertically centered modal dialog"
                centered
                visible={modalVisible}
                onOk={() => {
                    switch (clickDownLoadFileType) {
                        case HTML_TYPE:
                            if (fileName.endsWith('.html')) {
                                createAndDownloadFile(fileName, htmlCode);
                            } else {
                                createAndDownloadFile(fileName + '.html', htmlCode);
                            }
                            break;
                        case PDF_TYPE:
                            let worker = html2pdf();
                            if (fileName.endsWith('.pdf')) {
                                worker.from(htmlCode).save(fileName);
                            } else {
                                worker.from(htmlCode).save(fileName + '.pdf');
                            }
                            break;
                        default:
                            break;
                    }
                    setModalVisible(false);
                }}
                onCancel={() => setModalVisible(false)}
            >
                <Input required={true} value={fileName} size={"large"} placeholder={"输入文件名"} onChange={event => setFileName(event.target.value)}/>
            </Modal>
        </div>
    );
}
function createAndDownloadFile(fileName, content) {
    let aTag = document.createElement('a');
    let blob = new Blob([content]);
    aTag.download = fileName;
    aTag.href = URL.createObjectURL(blob);
    aTag.click();
    URL.revokeObjectURL(blob.toString());
}
export default App;
