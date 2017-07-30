<?xml version="1.0"?>
<xsl:stylesheet
	version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns="http://www.w3.org/1999/xhtml">

<xsl:output method="html" version="5.0" doctype-system="about:legacy-compat" />

<xsl:template match="/">
	<html>
	<body>
	<div id="xml">
		<span class="declare"><![CDATA[<]]>?xml <span class="version">version="1.0"</span>?<![CDATA[>]]></span>
		<xsl:apply-templates select="child::*" />
	</div>
	</body>
	</html>
</xsl:template>

<xsl:template name="ns">
	<xsl:for-each select="namespace::*">
		<span class="namespace">@xmlns:<span class="prefix"><xsl:value-of select="local-name()" /></span>="<span class="URN"><xsl:value-of select="." /></span>" </span>
	</xsl:for-each>
</xsl:template>

<xsl:template name="at">
	<xsl:for-each select="@*">
		<span class="attribute" draggable="true">@<span class="name"><xsl:value-of select="name()" /></span>=<span class="value" contentEditable="true"><xsl:value-of select="." /></span> </span>
	</xsl:for-each>
</xsl:template>

<xsl:template match="*">
	<div class="element">
		<xsl:if test="current()!=/*"><xsl:attribute name="draggable">true</xsl:attribute></xsl:if>
		<span class="name"><xsl:value-of select="name()" /></span>
		<xsl:if test="current()=/*"><xsl:call-template name="ns" /></xsl:if>
		<xsl:call-template name="at" />
		<xsl:apply-templates select="node()" />
	</div>
</xsl:template>

<xsl:template match="text()"><xsl:if test="string-length(normalize-space(.))&gt;0"><div class="text" draggable="true"><span class="value" contentEditable="true"><xsl:value-of select="." /></span></div></xsl:if></xsl:template>

<xsl:template match="comment()"><div class="comment" draggable="true">/* <span class="value" contentEditable="true"><xsl:value-of select="." /></span> */</div></xsl:template>

<xsl:template match="processing-instruction()">
	<div class="processing-instruction" draggable="true">?<span class="target"><xsl:value-of select="name()" /></span> <span class="data" contentEditable="true"><xsl:value-of select="." /></span>?</div>
</xsl:template>


</xsl:stylesheet>