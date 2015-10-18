<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:nxl="http://mutan8.exout.net/">
<!--
<xsl:output method="text" />
-->
<xsl:template match="nxl:var">var <xsl:call-template name="split"><xsl:with-param name="array" select="@name" /><xsl:with-param name="sep" select="' '" /><xsl:with-param name="arysep" select="' , '" /></xsl:call-template><xsl:choose><xsl:when test="@value"> = <xsl:value-of select="@value" /></xsl:when><xsl:when test="child::text()"> = <xsl:value-of select="child::text()" /></xsl:when></xsl:choose>;</xsl:template>

<xsl:template match="nxl:func">function <xsl:value-of select="@name" />(<xsl:call-template name="split"><xsl:with-param name="array" select="@arg" /><xsl:with-param name="sep" select="' '" /><xsl:with-param name="arysep" select="' , '" /></xsl:call-template>){<xsl:apply-templates />};</xsl:template>

<xsl:template match="nxl:return-value">return<xsl:if test="@select"> (<xsl:value-of select="@select" />)</xsl:if>;</xsl:template>

<xsl:template match="nxl:call"><xsl:value-of select="@select" />(<xsl:call-template name="split"><xsl:with-param name="array" select="@arg" /><xsl:with-param name="sep" select="' '" /><xsl:with-param name="arysep" select="' , '" /></xsl:call-template>);</xsl:template>

<xsl:template name="split">
	<xsl:param name="array" /><xsl:param name="sep" /><xsl:param name="arysep" />
	<xsl:choose>
		<xsl:when test="substring-after($array,$sep)=''"><xsl:value-of select="$array" /></xsl:when>
		<xsl:otherwise><xsl:value-of select="substring-before($array,$sep)" />$arysep<xsl:call-template name="split"><xsl:with-param name="array" select="substring-after($array,$sep)" /></xsl:call-template></xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template match="nxl:while">while (<xsl:value-of select="@test" />){<xsl:apply-templates />};</xsl:template>

<xsl:template match="nxl:for[@test]">for (<xsl:value-of select="@init" />;<xsl:value-of select="@test" />;<xsl:value-of select="next" />){<xsl:apply-templates />};</xsl:template>

<xsl:template match="nxl:break">break;</xsl:template>

<xsl:template match="nxl:continue">continue;</xsl:template>

<xsl:template match="nxl:switch">switch (<xsl:value-of select="@select" />){<xsl:apply-templates />};</xsl:template>

<xsl:template match="nxl:case">case <xsl:value-of select="@value" />: <xsl:apply-templates /> break;</xsl:template>

<xsl:template match="nxl:default">default : <xsl:apply-templates /> break;</xsl:template>

<xsl:template match="nxl:if">if (<xsl:value-of select="@test" />){<xsl:apply-templates select="nxl:then" />}<xsl:apply-templates select="nxl:else" />;</xsl:template>

<xsl:template match="nxl:then"><xsl:apply-templates /></xsl:template>

<xsl:template match="nxl:else">else<xsl:if test="@test">&#0032;if (<xsl:value-of select="@test" />)</xsl:if>{<xsl:apply-templates />}</xsl:template>

<xsl:include href="xmath.xsl" />

</xsl:stylesheet>